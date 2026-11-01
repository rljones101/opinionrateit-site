const BaseService = require('./BaseService')
const { keys } = require('./entities')

/**
 * DynamoDB service for review likes and replies.
 *
 * Replaces the Mongoose ReviewLike and ReviewReply models.
 *
 * Like   PK = REVIEWLIKE#<reviewId>  SK = USER#<userId>   (deterministic SK
 *        enforces one-like-per-user, replacing the Mongo unique compound index)
 * Reply  PK = REVIEWREPLY#<reviewId> SK = REPLY#<ts>#<replyId>  (time-ordered)
 */
class ReviewInteractionService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  // --- Likes ---------------------------------------------------------------

  /**
   * Add a like. Returns { created, likesCount }. `created` is false if the
   * user had already liked (idempotent — no duplicate).
   */
  async like(reviewId, userId) {
    const key = { PK: keys.likePK(reviewId), SK: keys.likeSK(userId) }
    const existing = await this.getItem(key)
    if (existing) {
      return { created: false, likesCount: await this.countLikes(reviewId) }
    }
    await this.putItem({
      ...key,
      reviewId,
      userId,
      createdAt: new Date().toISOString()
    })
    return { created: true, likesCount: await this.countLikes(reviewId) }
  }

  async unlike(reviewId, userId) {
    const key = { PK: keys.likePK(reviewId), SK: keys.likeSK(userId) }
    const existing = await this.getItem(key)
    if (!existing) return { removed: false, likesCount: await this.countLikes(reviewId) }
    await this.deleteItem(key)
    return { removed: true, likesCount: await this.countLikes(reviewId) }
  }

  async countLikes(reviewId) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.likePK(reviewId),
        ':sk': keys.likeSKPrefix()
      },
      Select: 'COUNT'
    })
    return result.count || 0
  }

  async hasLiked(reviewId, userId) {
    const item = await this.getItem({ PK: keys.likePK(reviewId), SK: keys.likeSK(userId) })
    return !!item
  }

  // --- Replies -------------------------------------------------------------

  async addReply(reviewId, user, content, parentReplyId = null) {
    const timestamp = new Date().toISOString()
    const replyId = this.generateId()
    const item = {
      PK: keys.replyPK(reviewId),
      SK: keys.replySK(timestamp, replyId),
      replyId,
      reviewId,
      // Denormalise the author (no populate in DynamoDB).
      userId: user.userId,
      userName: user.name,
      userPhoto: user.photo || '',
      content,
      parentReplyId: parentReplyId || null,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    await this.putItem(item)
    return this.formatReply(item)
  }

  async listReplies(reviewId, { limit = 10, offset = 0, sort = 'newest' } = {}) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.replyPK(reviewId),
        ':sk': keys.replySKPrefix()
      }
    })
    let items = result.items.map((i) => this.formatReply(i))
    items.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sort === 'oldest' ? diff : -diff
    })
    const total = items.length
    return { replies: items.slice(offset, offset + limit), total, hasMore: offset + limit < total }
  }

  async getReply(reviewId, replyId) {
    // Replies are keyed with a timestamp in the SK, so find by scanning the
    // review's reply partition for the matching replyId.
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.replyPK(reviewId),
        ':sk': keys.replySKPrefix()
      }
    })
    return result.items.find((r) => r.replyId === replyId) || null
  }

  async deleteReply(reviewId, replyId, userId) {
    const raw = await this.getReply(reviewId, replyId)
    if (!raw || raw.userId !== userId) return false
    await this.deleteItem({ PK: raw.PK, SK: raw.SK })
    return true
  }

  formatReply(item) {
    return {
      id: item.replyId,
      reviewId: item.reviewId,
      userId: item.userId,
      user: {
        id: item.userId,
        name: item.userName,
        avatar: item.userPhoto
      },
      content: item.content,
      parentReplyId: item.parentReplyId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }
}

module.exports = ReviewInteractionService
