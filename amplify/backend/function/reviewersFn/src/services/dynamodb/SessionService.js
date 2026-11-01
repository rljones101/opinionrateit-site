const crypto = require('crypto')
const BaseService = require('./BaseService')
const UAParser = require('ua-parser-js')

/**
 * DynamoDB service for user login sessions.
 *
 * Replaces the Mongoose UserSession model. Uses the dedicated `user-sessions`
 * table (resolved to `user-sessions-<prefix>`).
 *
 * Single-table layout
 * --------------------
 * PK = USER#<userId>        SK = SESSION#<sessionId>
 * GSI1PK = TOKEN#<tokenHash> GSI1SK = TOKEN#<tokenHash>
 *
 * Access patterns
 * - List a user's sessions  -> Query PK=USER#<userId> AND begins_with(SK,'SESSION#')
 * - Find session by token   -> Query GSI1 where GSI1PK=TOKEN#<hash>
 * - Revoke a session        -> DeleteItem PK/SK
 *
 * Security: the raw JWT is never stored. We store a SHA-256 hash of it and
 * look sessions up by that hash. Expiry is enforced both by a stored
 * `expiresAt` check and by a DynamoDB TTL attribute (`ttl`, epoch seconds).
 */
class SessionService extends BaseService {
  constructor() {
    super('user-sessions')
  }

  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  format(item) {
    if (!item) return null
    const { PK, SK, GSI1PK, GSI1SK, tokenHash, ttl, ...rest } = item
    return { ...rest, id: item.sessionId }
  }

  /**
   * Create a session for a freshly-issued token.
   */
  async createSession(userId, token, userAgent, ipAddress) {
    const parser = new UAParser(userAgent || '')
    const ua = parser.getResult()

    const sessionId = this.generateId()
    const tokenHash = SessionService.hashToken(token)

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + 30) // 30-day sessions

    const item = {
      PK: `USER#${userId}`,
      SK: `SESSION#${sessionId}`,
      GSI1PK: `TOKEN#${tokenHash}`,
      GSI1SK: `TOKEN#${tokenHash}`,
      sessionId,
      userId,
      tokenHash,
      device: ua.device.model || ua.device.type || 'Desktop',
      browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
      os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim(),
      location: 'Unknown Location',
      ipAddress: ipAddress || 'Unknown',
      lastActive: now.toISOString(),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ttl: Math.floor(expiresAt.getTime() / 1000) // DynamoDB TTL (epoch seconds)
    }

    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * Find a session by its JWT (hashes then queries GSI1). Returns the raw item
   * (incl. userId/expiresAt) so callers can validate; null if not found.
   */
  async findByToken(token) {
    const tokenHash = SessionService.hashToken(token)
    const result = await this.query('GSI1PK = :pk', {
      IndexName: 'GSI1',
      ExpressionAttributeValues: { ':pk': `TOKEN#${tokenHash}` },
      Limit: 1
    })
    return result.items.length > 0 ? result.items[0] : null
  }

  isExpired(session) {
    if (!session || !session.expiresAt) return false
    return Date.now() > new Date(session.expiresAt).getTime()
  }

  /**
   * Bump lastActive. Best-effort — callers don't await.
   */
  async touch(session) {
    if (!session) return
    try {
      await this.updateItem(
        { PK: `USER#${session.userId}`, SK: `SESSION#${session.sessionId}` },
        'SET lastActive = :la',
        { ':la': new Date().toISOString() }
      )
    } catch (err) {
      console.error('Failed to update session activity:', err.message)
    }
  }

  /**
   * List a user's sessions (newest first).
   */
  async listForUser(userId) {
    const result = await this.query(
      'PK = :pk AND begins_with(SK, :sk)',
      {
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk': 'SESSION#'
        }
      }
    )
    const sessions = result.items.map((item) => this.format(item))
    return sessions.sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    )
  }

  async getById(userId, sessionId) {
    const item = await this.getItem({
      PK: `USER#${userId}`,
      SK: `SESSION#${sessionId}`
    })
    return item // raw (keep tokenHash for current-session comparison)
  }

  async revoke(userId, sessionId) {
    return await this.deleteItem({
      PK: `USER#${userId}`,
      SK: `SESSION#${sessionId}`
    })
  }

  /**
   * Revoke every session for a user except the one whose token hash is given.
   */
  async revokeAllExcept(userId, keepTokenHash) {
    const result = await this.query(
      'PK = :pk AND begins_with(SK, :sk)',
      {
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk': 'SESSION#'
        }
      }
    )
    const toDelete = result.items.filter((s) => s.tokenHash !== keepTokenHash)
    await Promise.all(
      toDelete.map((s) =>
        this.deleteItem({ PK: s.PK, SK: s.SK })
      )
    )
    return toDelete.length
  }
}

module.exports = SessionService
