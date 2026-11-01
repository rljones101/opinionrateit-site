const BaseService = require('./BaseService')
const { keys } = require('./entities')

/**
 * DynamoDB service for a user's bookmarked videos.
 *
 * Replaces the Mongoose BookmarkedVideo model. One item per (user, video),
 * keyed PK = USER#<userId>, SK = BOOKMARK#<videoId> — the deterministic SK
 * gives us uniqueness for free (an "upsert" is just a put).
 */
class BookmarkService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  format(item) {
    if (!item) return null
    const { PK, SK, ...rest } = item
    return rest
  }

  /**
   * Add (or re-activate) a bookmark.
   */
  async add(userId, videoId) {
    const item = {
      PK: keys.bookmarkPK(userId),
      SK: keys.bookmarkSK(videoId),
      userId,
      videoId,
      bookmarked: true,
      createdAt: new Date().toISOString()
    }
    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * List a user's active bookmarks (newest/oldest by createdAt).
   */
  async listForUser(userId, { sort = 'newest' } = {}) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.bookmarkPK(userId),
        ':sk': keys.bookmarkSKPrefix()
      }
    })
    const items = result.items.map((i) => this.format(i)).filter((b) => b.bookmarked)
    items.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sort === 'oldest' ? diff : -diff
    })
    return items
  }

  async getByVideo(userId, videoId) {
    const item = await this.getItem({
      PK: keys.bookmarkPK(userId),
      SK: keys.bookmarkSK(videoId)
    })
    return this.format(item)
  }

  /**
   * Soft-remove (bookmarked:false) by videoId.
   */
  async removeByVideo(userId, videoId) {
    const existing = await this.getByVideo(userId, videoId)
    if (!existing) return null
    const updated = await this.updateItem(
      { PK: keys.bookmarkPK(userId), SK: keys.bookmarkSK(videoId) },
      'SET bookmarked = :b',
      { ':b': false }
    )
    return this.format(updated)
  }
}

module.exports = BookmarkService
