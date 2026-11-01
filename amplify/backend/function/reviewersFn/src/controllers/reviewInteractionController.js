const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const ReviewInteractionService = require('../services/dynamodb/ReviewInteractionService')

const interactionService = new ReviewInteractionService()

const uid = (req) => req.user.userId || req.user.id

// POST /api/v1/review-interactions/:reviewId/like
exports.likeReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  const result = await interactionService.like(reviewId, uid(req))

  if (!result.created) {
    return next(new AppError('You have already liked this review', 400))
  }

  res.status(200).json({
    status: 'success',
    data: {
      like: { reviewId, userId: uid(req) },
      likesCount: result.likesCount
    }
  })
})

// DELETE /api/v1/review-interactions/:reviewId/like
exports.unlikeReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  const result = await interactionService.unlike(reviewId, uid(req))

  if (!result.removed) {
    return next(new AppError('Like not found', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { likesCount: result.likesCount }
  })
})

// GET /api/v1/review-interactions/:reviewId/replies
exports.getReplies = catchAsync(async (req, res) => {
  const { reviewId } = req.params
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'newest'

  const { replies, total, hasMore } = await interactionService.listReplies(reviewId, {
    limit,
    offset,
    sort
  })

  res.status(200).json({
    status: 'success',
    data: { replies, total, hasMore }
  })
})

// POST /api/v1/review-interactions/:reviewId/replies
exports.addReply = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  const { content, parentReplyId } = req.body

  if (!content || content.trim().length === 0) {
    return next(new AppError('Reply content is required', 400))
  }
  if (content.length > 500) {
    return next(new AppError('Reply cannot exceed 500 characters', 400))
  }

  const reply = await interactionService.addReply(
    reviewId,
    { userId: uid(req), name: req.user.name, photo: req.user.photo },
    content.trim(),
    parentReplyId || null
  )

  res.status(201).json({
    status: 'success',
    data: { reply }
  })
})

// DELETE /api/v1/review-interactions/:reviewId/replies/:replyId
exports.deleteReply = catchAsync(async (req, res, next) => {
  const { reviewId, replyId } = req.params
  const deleted = await interactionService.deleteReply(reviewId, replyId, uid(req))

  if (!deleted) {
    return next(new AppError('Reply not found or you do not have permission', 404))
  }

  res.status(200).json({ status: 'success', message: 'Reply deleted' })
})
