const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const WatchHistoryService = require('../services/dynamodb/WatchHistoryService')
const PublishedVideoService = require('../services/dynamodb/PublishedVideoService')

const watchHistoryService = new WatchHistoryService()
const videoService = new PublishedVideoService()

const uid = (req) => req.user.userId || req.user.id

function mapVideo(video) {
  if (!video) return null
  return {
    id: video.videoId,
    title: video.title,
    description: video.description || '',
    thumbnailUrl: video.thumbnail,
    channelId: video.channelId,
    channelTitle: video.channelTitle || '',
    duration: video.duration,
    viewCount: video.viewCount,
    publishedAt: video.publishedAt
  }
}

function sinceFromFilter(dateFilter) {
  const now = new Date()
  if (dateFilter === 'today') return new Date(now.setHours(0, 0, 0, 0)).getTime()
  if (dateFilter === 'week') return new Date(now.setDate(now.getDate() - 7)).getTime()
  if (dateFilter === 'month') return new Date(now.setMonth(now.getMonth() - 1)).getTime()
  return null
}

// GET /api/v1/watch-history
exports.getWatchHistory = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'recent'
  const since = sinceFromFilter(req.query.dateFilter || 'all')

  const all = await watchHistoryService.listForUser(uid(req), { sort, since })
  const total = all.length
  const pageItems = all.slice(offset, offset + limit)

  const history = (
    await Promise.all(
      pageItems.map(async (item) => {
        const video = await videoService.getByVideoId(item.videoId)
        if (!video) return null
        const progressPercentage = item.videoDuration
          ? Math.round((item.watchDuration / item.videoDuration) * 100)
          : 0
        return {
          id: item.videoId,
          userId: item.userId,
          videoId: item.videoId,
          watchedAt: item.watchedAt,
          watchDuration: item.watchDuration,
          videoDuration: item.videoDuration,
          lastPosition: item.lastPosition,
          completed: item.completed,
          updatedAt: item.updatedAt,
          progressPercentage,
          video: mapVideo(video)
        }
      })
    )
  ).filter((h) => h !== null)

  res.status(200).json({
    status: 'success',
    data: {
      history,
      total,
      hasMore: offset + limit < total
    }
  })
})

// POST /api/v1/watch-history
exports.trackWatch = catchAsync(async (req, res, next) => {
  const { videoId, watchDuration, videoDuration, lastPosition, completed } = req.body
  if (!videoId || watchDuration === undefined || !videoDuration) {
    return next(new AppError('Missing required fields', 400))
  }

  const history = await watchHistoryService.track(uid(req), {
    videoId,
    watchDuration,
    videoDuration,
    lastPosition,
    completed
  })

  res.status(200).json({
    status: 'success',
    data: { history }
  })
})

// GET /api/v1/watch-history/video/:videoId
exports.getLastPosition = catchAsync(async (req, res) => {
  const history = await watchHistoryService.getForVideo(uid(req), req.params.videoId)
  const shouldResume = !!history && !history.completed && history.lastPosition > 30

  res.status(200).json({
    status: 'success',
    data: {
      history,
      lastPosition: history ? history.lastPosition : 0,
      shouldResume
    }
  })
})

// DELETE /api/v1/watch-history/:historyId  (historyId == videoId)
exports.removeHistoryItem = catchAsync(async (req, res, next) => {
  const removed = await watchHistoryService.remove(uid(req), req.params.historyId)
  if (!removed) {
    return next(new AppError('History item not found', 404))
  }
  res.status(200).json({ status: 'success', message: 'History item removed' })
})

// DELETE /api/v1/watch-history
exports.clearHistory = catchAsync(async (req, res) => {
  await watchHistoryService.clear(uid(req))
  res.status(200).json({ status: 'success', message: 'Watch history cleared' })
})
