const BaseService = require('./BaseService')
const { keys } = require('./entities')

/**
 * DynamoDB service for user activity events.
 *
 * Replaces the Mongoose UserActivity model. Activities live under their user's
 * partition with a timestamp-prefixed SK so they sort newest-first within a
 * Query (ScanIndexForward:false).
 *
 * PK = USER#<userId>   SK = ACTIVITY#<isoTimestamp>#<activityId>
 */
class ActivityService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  format(item) {
    if (!item) return null
    const { PK, SK, ...rest } = item
    return { ...rest, id: item.activityId }
  }

  /**
   * Record an activity. Error-swallowing — activity logging must never break
   * the main flow (matches the old model static).
   */
  async logActivity(userId, type, title, description, metadata) {
    try {
      const timestamp = new Date().toISOString()
      const activityId = this.generateId()
      await this.putItem({
        PK: keys.activityPK(userId),
        SK: keys.activitySK(timestamp, activityId),
        activityId,
        userId,
        type,
        title,
        description: description || '',
        metadata: metadata || {},
        timestamp
      })
    } catch (error) {
      console.error('Failed to log activity:', error.message)
    }
  }

  /**
   * Paginated, optionally type-filtered activity list (newest first).
   * Returns { activities, total, hasMore } for the given offset/limit window.
   */
  async getActivity(userId, { limit = 20, offset = 0, types = null } = {}) {
    // Fetch the user's activities newest-first. The per-user volume is modest,
    // so we page in-memory after the Query (keeps type-filtering simple).
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.activityPK(userId),
        ':sk': keys.activitySKPrefix()
      },
      ScanIndexForward: false // newest first
    })

    let items = result.items.map((i) => this.format(i))
    if (types && types.length > 0) {
      items = items.filter((a) => types.includes(a.type))
    }

    const total = items.length
    const page = items.slice(offset, offset + limit)
    return { activities: page, total, hasMore: offset + limit < total }
  }

  /**
   * Activity stats: total reviews, total video views, and activity in the last
   * 7 days — mirrors the old getStats static.
   */
  async getStats(userId) {
    const result = await this.query('PK = :pk AND begins_with(SK, :sk)', {
      ExpressionAttributeValues: {
        ':pk': keys.activityPK(userId),
        ':sk': keys.activitySKPrefix()
      }
    })
    const items = result.items
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    return {
      totalReviews: items.filter((i) => i.type === 'review').length,
      totalVideoViews: items.filter((i) => i.type === 'video_view').length,
      thisWeekActivity: items.filter((i) => new Date(i.timestamp).getTime() >= oneWeekAgo).length
    }
  }
}

module.exports = ActivityService
