const BaseService = require('./BaseService')
const { keys } = require('./entities')
const AppError = require('../../utils/appError')

/**
 * DynamoDB service for PublishedVideo entities.
 *
 * Replaces the Mongoose PublishedVideo model. Videos are stored in their
 * reviewer's partition (PK=REVIEWER#<channelId>, SK=VIDEO#<videoId>) so that
 * listing a channel's videos is a single Query, and are also indexed on GSI1
 * (GSI1PK=VIDEO) so the whole catalog can be listed/searched and a single
 * video looked up by its videoId.
 */
class PublishedVideoService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  /**
   * Shape a raw item into the frontend-facing response. The Vue client's
   * PublishedVideo type reads `_id`/`id`, `videoId`, `channelId`, `title`,
   * `thumbnail`, `active`, and `user`.
   */
  format(item) {
    if (!item) return null
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...rest } = item
    return {
      ...rest,
      _id: item.videoId,
      id: item.videoId
    }
  }

  /**
   * Create a single published video.
   */
  async createVideo(data) {
    if (!data || !data.channelId) {
      throw new AppError('A published video requires a channel Id', 400)
    }
    if (!data.videoId) {
      throw new AppError('A video Id is required', 400)
    }
    if (!data.title || data.title.length < 8) {
      throw new AppError('A title must be at least 8 characters long', 400)
    }
    if (!data.thumbnail) {
      throw new AppError('A video requires a thumbnail', 400)
    }

    const item = {
      PK: keys.videoPK(data.channelId),
      SK: keys.videoSK(data.videoId),
      GSI1PK: keys.videoGSI1PK(),
      GSI1SK: keys.videoGSI1SK(data.videoId),
      videoId: data.videoId,
      channelId: data.channelId,
      title: data.title,
      thumbnail: data.thumbnail,
      user: data.user || null,
      active: data.active !== undefined ? data.active : true,
      createdAt: data.createdAt || new Date().toISOString()
    }

    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * Create many videos at once (batches of 25 per DynamoDB limits).
   */
  async createMany(videos = []) {
    const created = []
    for (const video of videos) {
      // Reuse single-create for validation + key building.
      created.push(await this.createVideo(video))
    }
    return created
  }

  /**
   * List every video for a channel (Query on the base table partition).
   */
  async getByChannelId(channelId) {
    const result = await this.query(
      'PK = :pk AND begins_with(SK, :skPrefix)',
      {
        ExpressionAttributeValues: {
          ':pk': keys.videoPK(channelId),
          ':skPrefix': keys.videoSKPrefix()
        }
      }
    )
    return result.items.map((item) => this.format(item))
  }

  /**
   * Get a single video by its videoId (via GSI1).
   */
  async getByVideoId(videoId) {
    const result = await this.query(
      'GSI1PK = :pk AND GSI1SK = :sk',
      {
        IndexName: 'GSI1',
        ExpressionAttributeValues: {
          ':pk': keys.videoGSI1PK(),
          ':sk': keys.videoGSI1SK(videoId)
        },
        Limit: 1
      }
    )
    return result.items.length > 0 ? this.format(result.items[0]) : null
  }

  /**
   * List the whole video catalog (via GSI1 partition VIDEO).
   */
  async getAll() {
    const result = await this.query('GSI1PK = :pk', {
      IndexName: 'GSI1',
      ExpressionAttributeValues: { ':pk': keys.videoGSI1PK() }
    })
    return result.items.map((item) => this.format(item))
  }

  /**
   * Case-insensitive search over the catalog. Mirrors the old
   * handlerFactory.search behaviour, which supported a single
   * field/value pair (in practice `title`).
   */
  async search(field, value) {
    const all = await this.getAll()
    if (!field || !value) return all
    const needle = String(value).toLowerCase()
    return all.filter((video) => {
      const haystack = video[field]
      return typeof haystack === 'string' && haystack.toLowerCase().includes(needle)
    })
  }

  /**
   * Delete a video (needs channelId + videoId to build the key).
   */
  async deleteVideo(channelId, videoId) {
    return await this.deleteItem({
      PK: keys.videoPK(channelId),
      SK: keys.videoSK(videoId)
    })
  }
}

module.exports = PublishedVideoService
