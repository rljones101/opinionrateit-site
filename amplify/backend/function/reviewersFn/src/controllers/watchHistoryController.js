const WatchHistory = require('../models/watchHistoryModel')
const PublishedVideo = require('../models/publishedVideoModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Get watch history
exports.getWatchHistory = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'recent'
  const dateFilter = req.query.dateFilter || 'all'
  
  const sortOption = sort === 'oldest' ? { watchedAt: 1 } : { watchedAt: -1 }
  
  // Date filtering
  let dateQuery = {}
  const now = new Date()
  if (dateFilter === 'today') {
    dateQuery = { watchedAt: { $gte: new Date(now.setHours(0,0,0,0)) } }
  } else if (dateFilter === 'week') {
    dateQuery = { watchedAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } }
  } else if (dateFilter === 'month') {
    dateQuery = { watchedAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } }
  }
  
  const history = await WatchHistory.find({
    userId: req.user.id,
    ...dateQuery
  })
    .sort(sortOption)
    .skip(offset)
    .limit(limit)
  
  // Populate video details
  const historyWithVideos = await Promise.all(
    history.map(async (item) => {
      const video = await PublishedVideo.findOne({ youTubeId: item.videoId })
      const progressPercentage = Math.round((item.watchDuration / item.videoDuration) * 100)
      
      return {
        id: item._id,
        userId: item.userId,
        videoId: item.videoId,
        watchedAt: item.watchedAt,
        watchDuration: item.watchDuration,
        videoDuration: item.videoDuration,
        lastPosition: item.lastPosition,
        completed: item.completed,
        updatedAt: item.updatedAt,
        progressPercentage,
        video: video ? {
          id: video.youTubeId,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnail,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          duration: video.duration,
          viewCount: video.viewCount,
          publishedAt: video.publishedAt
        } : null
      }
    })
  )
  
  const total = await WatchHistory.countDocuments({
    userId: req.user.id,
    ...dateQuery
  })
  
  res.status(200).json({
    status: 'success',
    data: {
      history: historyWithVideos.filter(h => h.video !== null),
      total,
      hasMore: offset + limit < total
    }
  })
})

// Track watch (upsert)
exports.trackWatch = catchAsync(async (req, res, next) => {
  const { videoId, watchDuration, videoDuration, lastPosition, completed } = req.body
  
  if (!videoId || watchDuration === undefined || !videoDuration) {
    return next(new AppError('Missing required fields', 400))
  }
  
  const history = await WatchHistory.findOneAndUpdate(
    { userId: req.user.id, videoId },
    {
      userId: req.user.id,
      videoId,
      watchDuration,
      videoDuration,
      lastPosition: lastPosition || watchDuration,
      completed: completed || false,
      watchedAt: Date.now(),
      updatedAt: Date.now()
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  
  res.status(200).json({
    status: 'success',
    data: { history }
  })
})

// Get last position for video
exports.getLastPosition = catchAsync(async (req, res, next) => {
  const history = await WatchHistory.findOne({
    userId: req.user.id,
    videoId: req.params.videoId
  })
  
  const shouldResume = history && !history.completed && history.lastPosition > 30
  
  res.status(200).json({
    status: 'success',
    data: {
      history,
      lastPosition: history ? history.lastPosition : 0,
      shouldResume
    }
  })
})

// Remove history item
exports.removeHistoryItem = catchAsync(async (req, res, next) => {
  const history = await WatchHistory.findOneAndDelete({
    _id: req.params.historyId,
    userId: req.user.id
  })
  
  if (!history) {
    return next(new AppError('History item not found', 404))
  }
  
  res.status(200).json({
    status: 'success',
    message: 'History item removed'
  })
})

// Clear all history
exports.clearHistory = catchAsync(async (req, res, next) => {
  await WatchHistory.deleteMany({ userId: req.user.id })
  
  res.status(200).json({
    status: 'success',
    message: 'Watch history cleared'
  })
})
