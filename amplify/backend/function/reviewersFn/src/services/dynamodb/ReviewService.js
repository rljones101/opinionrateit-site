const BaseService = require('./BaseService')
const { keys } = require('./entities')
const AppError = require('../../utils/appError')

/**
 * DynamoDB service for Review entities (the "comments"/reviews on a video).
 *
 * Replaces the Mongoose Review model's read/create paths. Because DynamoDB has
 * no populate, the reviewing user's display info is denormalised onto the item
 * as a `user` object so the frontend (ReviewCard reads `review.user.name`) works
 * unchanged.
 */
class ReviewService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  format(item) {
    if (!item) return null
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...rest } = item
    return {
      ...rest,
      _id: item.reviewId,
      id: item.reviewId
    }
  }

  /**
   * Create a review for a video. `user` may be a denormalised object
   * ({ userId, name }) or a string id (a minimal object is built from it).
   */
  async createReview(data) {
    if (!data || !data.videoId) {
      throw new AppError('A review requires a video id', 400)
    }
    if (!data.channelId) {
      throw new AppError('A YouTube Channel Id is required', 400)
    }
    if (!data.user) {
      throw new AppError('Review must have a user', 400)
    }

    const reviewId = data.reviewId || this.generateId()
    const user =
      typeof data.user === 'string'
        ? { userId: data.user, name: data.userName || 'User' }
        : data.user

    const item = {
      PK: keys.reviewPK(data.videoId),
      SK: keys.reviewSK(reviewId),
      GSI1PK: keys.reviewGSI1PK(data.channelId),
      GSI1SK: keys.reviewGSI1SK(reviewId),
      reviewId,
      videoId: data.videoId,
      channelId: data.channelId,
      user,
      comment: data.comment || '',
      clarity: num(data.clarity),
      product_view: num(data.product_view),
      product_detail_explanation: num(data.product_detail_explanation),
      non_bias: num(data.non_bias),
      average_review_time: num(data.average_review_time),
      product_focus: num(data.product_focus),
      provided_resources: num(data.provided_resources),
      overall_presentation: num(data.overall_presentation),
      createdAt: data.createdAt || new Date().toISOString()
    }

    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * List all reviews for a video (Query on the video's partition).
   */
  async getByVideoId(videoId) {
    const result = await this.query(
      'PK = :pk AND begins_with(SK, :skPrefix)',
      {
        ExpressionAttributeValues: {
          ':pk': keys.reviewPK(videoId),
          ':skPrefix': keys.reviewSKPrefix()
        }
      }
    )
    return result.items.map((item) => this.format(item))
  }

  /**
   * Count reviews for a channel (Query count on GSI1).
   */
  async countByChannel(channelId) {
    const result = await this.query('GSI1PK = :pk', {
      IndexName: 'GSI1',
      ExpressionAttributeValues: { ':pk': keys.reviewGSI1PK(channelId) },
      Select: 'COUNT'
    })
    return result.count || 0
  }
}

function num(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

module.exports = ReviewService
