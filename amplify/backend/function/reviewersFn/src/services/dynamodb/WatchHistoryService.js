const BaseService = require('./BaseService')
const { keys } = require('./entities')

const TTL_DAYS = 90

/**
 * DynamoDB service for a user's video watch history.
 *
 * Replaces the Mongoose WatchHistory model. One item per (user, video):
 * PK = USER#<userId>, SK = WATCH#<videoId>. A DynamoDB TTL (`ttl`, epoch
 * seconds) auto-expires entries after 90 days, matching the old TTL index.
 */
class WatchHistoryService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  format(item) {
    if (!item) return null
    const { PK, SK, ttl, ...rest } = item
    return { ...rest, id: item.videoId }
  }

  /**
   * Upsert a watch record.
   */
  async track(userId, { videoId, watchDuration, videoDuration, lastPosition, completed }) {
    const now = new Date()
    const ttl = Math.floor(now.getTime() / 1000) + TTL_DAYS * 24 * 60 * 60

    const item = {
      PK: keys.watchPK(userId),
      SK: keys.watchSK(videoId),
      userId,
      videoId,
      watchDuration,
      videoDuration,
      lastPosition: lastPosition !== undefined ? lastPosition : watchDuration,
      completed: completed || false,
      watchedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      ttl
    }
    const saved = await this.putItem(item)
    return this.format(saved)
  }

  async getForVideo(userId, videoId) {
    const item = await this.getItem({
      PK: keys.watchPK(userId),
      SK: keys.watchSK(videoId)
    })
    return this.format(item)
  }

  /**
   * List a user's watch history, newest/oldest first, with an optional
   * `watchedAt >=` date floor (today/week/month).
   */
  async listForUser(userId, { sort = 'recent', since = null } = {}) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.watchPK(userId),
        ':sk': keys.watchSKPrefix()
      }
    })
    let items = result.items.map((i) => this.format(i))
    if (since) {
      items = items.filter((h) => new Date(h.watchedAt).getTime() >= since)
    }
    items.sort((a, b) => {
      const diff = new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime()
      return sort === 'oldest' ? diff : -diff
    })
    return items
  }

  async remove(userId, videoId) {
    const existing = await this.getForVideo(userId, videoId)
    if (!existing) return null
    await this.deleteItem({ PK: keys.watchPK(userId), SK: keys.watchSK(videoId) })
    return existing
  }

  async clear(userId) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.watchPK(userId),
        ':sk': keys.watchSKPrefix()
      }
    })
    await Promise.all(
      result.items.map((i) => this.deleteItem({ PK: i.PK, SK: i.SK }))
    )
    return result.items.length
  }
}

module.exports = WatchHistoryService
