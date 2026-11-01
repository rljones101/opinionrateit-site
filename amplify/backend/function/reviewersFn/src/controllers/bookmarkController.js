const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const BookmarkService = require('../services/dynamodb/BookmarkService')
const PublishedVideoService = require('../services/dynamodb/PublishedVideoService')

const bookmarkService = new BookmarkService()
const videoService = new PublishedVideoService()

const uid = (req) => req.user.userId || req.user.id

// Shape a DynamoDB video into the `video` object the frontend expects.
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

// GET /api/v1/bookmarks
exports.getBookmarks = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'newest'

  const all = await bookmarkService.listForUser(uid(req), { sort })
  const total = all.length
  const pageItems = all.slice(offset, offset + limit)

  const bookmarks = (
    await Promise.all(
      pageItems.map(async (b) => {
        const video = await videoService.getByVideoId(b.videoId)
        if (!video) return null
        return {
          id: b.videoId, // id == videoId in the single-table model
          userId: b.userId,
          videoId: b.videoId,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          video: mapVideo(video)
        }
      })
    )
  ).filter((b) => b !== null)

  res.status(200).json({
    status: 'success',
    data: {
      bookmarks,
      total,
      hasMore: offset + limit < total
    }
  })
})

// POST /api/v1/bookmarks  { videoId }
exports.addBookmark = catchAsync(async (req, res, next) => {
  const { videoId } = req.body
  if (!videoId) {
    return next(new AppError('Video ID is required', 400))
  }

  const bookmark = await bookmarkService.add(uid(req), videoId)

  res.status(200).json({
    status: 'success',
    data: {
      bookmark: {
        id: bookmark.videoId,
        userId: bookmark.userId,
        videoId: bookmark.videoId,
        createdAt: bookmark.createdAt
      }
    }
  })
})

// DELETE /api/v1/bookmarks/:bookmarkId  (bookmarkId == videoId)
exports.removeBookmark = catchAsync(async (req, res, next) => {
  const removed = await bookmarkService.removeByVideo(uid(req), req.params.bookmarkId)
  if (!removed) {
    return next(new AppError('Bookmark not found', 404))
  }
  res.status(200).json({ status: 'success', message: 'Bookmark removed' })
})

// DELETE /api/v1/bookmarks/video/:videoId
exports.removeBookmarkByVideoId = catchAsync(async (req, res, next) => {
  const removed = await bookmarkService.removeByVideo(uid(req), req.params.videoId)
  if (!removed) {
    return next(new AppError('Bookmark not found', 404))
  }
  res.status(200).json({ status: 'success', message: 'Bookmark removed' })
})
