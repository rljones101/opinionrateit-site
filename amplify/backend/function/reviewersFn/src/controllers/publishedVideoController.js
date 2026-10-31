const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const PublishedVideoService = require('../services/dynamodb/PublishedVideoService.js')
const ReviewerService = require('../services/dynamodb/ReviewerService.js')

const videoService = new PublishedVideoService()
const reviewerService = new ReviewerService()

// GET /api/v1/publishedVideos
exports.getAll = catchAsync(async (req, res) => {
  const doc = await videoService.getAll()

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc
  })
})

// GET /api/v1/publishedVideos/search?field=title&value=...
exports.search = catchAsync(async (req, res) => {
  const { field, value } = req.query
  const doc = await videoService.search(field, value)

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc
  })
})

// GET /api/v1/publishedVideos/:id  (id = videoId)
exports.getOne = catchAsync(async (req, res, next) => {
  const doc = await videoService.getByVideoId(req.params.id)

  if (!doc) {
    return next(new AppError('No document found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: doc
  })
})

// POST /api/v1/publishedVideos  (single)
exports.createOne = catchAsync(async (req, res) => {
  const doc = await videoService.createVideo(req.body)
  await syncVideoCount(doc.channelId)

  res.status(201).json({
    status: 'success',
    data: doc
  })
})

// PATCH /api/v1/publishedVideos/:id — not supported on DynamoDB layer yet.
exports.updateOne = catchAsync(async (req, res, next) => {
  return next(new AppError('Updating a published video is not supported', 501))
})

// DELETE /api/v1/publishedVideos/:id
exports.deleteOne = catchAsync(async (req, res, next) => {
  // Deleting needs the channelId to build the composite key; the client
  // passes it as a query param since the route key is the videoId.
  const videoId = req.params.id
  const channelId = req.query.channelId || req.body.channelId

  if (!channelId) {
    return next(new AppError('channelId is required to delete a video', 400))
  }

  await videoService.deleteVideo(channelId, videoId)
  await syncVideoCount(channelId)

  res.status(204).json({
    status: 'success',
    data: null
  })
})

// POST /api/v1/publishedVideos  (bulk) — matches the old createMultiple shape
exports.createMultiple = catchAsync(async (req, res) => {
  const videos = req.body.videos || []
  const doc = await videoService.createMany(videos)

  // Keep each affected reviewer's video count in sync.
  const channelIds = [...new Set(doc.map((v) => v.channelId))]
  await Promise.all(channelIds.map((id) => syncVideoCount(id)))

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})

// GET /api/v1/reviewers/:channelId/publishedVideos
exports.getVideosByChannel = catchAsync(async (req, res) => {
  const channelId = req.params.channelId
  const videos = await videoService.getByChannelId(channelId)

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: { videos }
  })
})

// GET /api/v1/publishedVideos/user/:userId
exports.getVideosByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId
  // The catalog is small; filter the GSI1 listing by user.
  const all = await videoService.getAll()
  const videos = all.filter((v) => v.user === userId || (v.user && v.user.userId === userId))

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: { videos }
  })
})

/**
 * Recompute and persist a reviewer's published-video count.
 */
async function syncVideoCount(channelId) {
  try {
    const videos = await videoService.getByChannelId(channelId)
    await reviewerService.setVideoCount(channelId, videos.length)
  } catch (err) {
    // Non-fatal: the count is a denormalised convenience field.
    console.error(`Failed to sync video count for ${channelId}:`, err.message)
  }
}
