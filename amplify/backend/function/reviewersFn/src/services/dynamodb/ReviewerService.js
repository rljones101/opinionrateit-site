const BaseService = require('./BaseService')
const { keys } = require('./entities')
const AppError = require('../../utils/appError')

/**
 * DynamoDB service for Reviewer entities.
 *
 * Replaces the Mongoose Reviewer model. A reviewer represents a YouTube
 * channel that has been added to the platform, keyed by its channelId.
 */
class ReviewerService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  /**
   * Shape a raw DynamoDB item into the response the frontend expects.
   * The Vue client reads `_id`/`id` and the avg* metric fields, so we
   * surface the channelId as the id and keep the metric fields intact.
   */
  format(item) {
    if (!item) return null
    // Strip internal single-table attributes from the response.
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...rest } = item
    return {
      ...rest,
      _id: item.channelId,
      id: item.channelId
    }
  }

  /**
   * Default metric fields so a freshly-created reviewer matches the old
   * Mongoose schema defaults (all averages 0).
   */
  static defaultMetrics() {
    return {
      numPublishedVideos: 0,
      avgClarity: 0,
      avgProductView: 0,
      avgProductDetailExplanation: 0,
      avgNonBias: 0,
      avgAverageReviewTime: 0,
      avgProductFocus: 0,
      avgProvidedResources: 0,
      avgShare: 0,
      avgOverallPresentation: 0,
      metric: 0,
      views: 0
    }
  }

  /**
   * Create (or overwrite) a reviewer for a channel.
   */
  async createReviewer(data) {
    if (!data || !data.channelId) {
      throw new AppError('A YouTube channelId is required for adding a reviewer', 400)
    }

    const channelId = data.channelId
    const item = {
      PK: keys.reviewerPK(channelId),
      SK: keys.reviewerSK(),
      GSI1PK: keys.reviewerGSI1PK(),
      GSI1SK: keys.reviewerGSI1SK(channelId),
      channelId,
      user: data.user || null,
      name: data.name || '',
      avatar: data.avatar || '',
      thumbnailMedium: data.thumbnailMedium || '',
      description: data.description || '',
      social: data.social || [],
      createdAt: data.createdAt || new Date().toISOString(),
      ...ReviewerService.defaultMetrics(),
      // Allow caller-supplied metrics to override the zero defaults.
      ...Object.fromEntries(
        Object.entries(ReviewerService.defaultMetrics()).map(([k]) => [k, data[k] ?? 0])
      )
    }

    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * Get a single reviewer by its channelId.
   */
  async getByChannelId(channelId) {
    const item = await this.getItem({
      PK: keys.reviewerPK(channelId),
      SK: keys.reviewerSK()
    })
    return this.format(item)
  }

  /**
   * List all reviewers (via GSI1 partition REVIEWER).
   */
  async getAll() {
    const result = await this.query('GSI1PK = :pk', {
      IndexName: 'GSI1',
      ExpressionAttributeValues: { ':pk': keys.reviewerGSI1PK() }
    })
    return result.items.map((item) => this.format(item))
  }

  /**
   * Update a reviewer's published-video count. Called after seeding / publishing.
   */
  async setVideoCount(channelId, count) {
    const updated = await this.updateItem(
      { PK: keys.reviewerPK(channelId), SK: keys.reviewerSK() },
      'SET numPublishedVideos = :count',
      { ':count': count }
    )
    return this.format(updated)
  }
}

module.exports = ReviewerService
