const BookmarkedVideo = require('../models/bookmarkedVideoModel')
const PublishedVideo = require('../models/publishedVideoModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Get all bookmarks for current user
exports.getBookmarks = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'newest'
  
  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }
  
  const bookmarks = await BookmarkedVideo.find({
    userId: req.user.id,
    bookmarked: true
  })
    .sort(sortOption)
    .skip(offset)
    .limit(limit)
  
  // Populate video details
  const bookmarksWithVideos = await Promise.all(
    bookmarks.map(async (bookmark) => {
      const video = await PublishedVideo.findById(bookmark.publishedVideoId)
      return {
        id: bookmark._id,
        userId: bookmark.userId,
        videoId: bookmark.publishedVideoId,
        createdAt: bookmark.createdAt,
        video: video ? {
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          duration: video.duration,
          viewCount: video.viewCount,
          publishedAt: video.publishedAt
        } : null
      }
    })
  )
  
  const total = await BookmarkedVideo.countDocuments({
    userId: req.user.id,
    bookmarked: true
  })
  
  res.status(200).json({
    status: 'success',
    data: {
      bookmarks: bookmarksWithVideos.filter(b => b.video !== null),
      total,
      hasMore: offset + limit < total
    }
  })
})

// Add bookmark
exports.addBookmark = catchAsync(async (req, res, next) => {
  const { videoId } = req.body
  
  if (!videoId) {
    return next(new AppError('Video ID is required', 400))
  }
  
  // Upsert (update if exists, create if not)
  const bookmark = await BookmarkedVideo.findOneAndUpdate(
    { userId: req.user.id, publishedVideoId: videoId },
    { userId: req.user.id, publishedVideoId: videoId, bookmarked: true, createdAt: Date.now() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  
  res.status(200).json({
    status: 'success',
    data: {
      bookmark: {
        id: bookmark._id,
        userId: bookmark.userId,
        videoId: bookmark.publishedVideoId,
        createdAt: bookmark.createdAt
      }
    }
  })
})

// Remove bookmark by ID
exports.removeBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await BookmarkedVideo.findOneAndUpdate(
    { _id: req.params.bookmarkId, userId: req.user.id },
    { bookmarked: false },
    { new: true }
  )
  
  if (!bookmark) {
    return next(new AppError('Bookmark not found', 404))
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Bookmark removed'
  })
})

// Remove bookmark by video ID
exports.removeBookmarkByVideoId = catchAsync(async (req, res, next) => {
  const bookmark = await BookmarkedVideo.findOneAndUpdate(
    { publishedVideoId: req.params.videoId, userId: req.user.id },
    { bookmarked: false },
    { new: true }
  )
  
  if (!bookmark) {
    return next(new AppError('Bookmark not found', 404))
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Bookmark removed'
  })
})
