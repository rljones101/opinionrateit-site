const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const ReviewService = require('../services/dynamodb/ReviewService.js')

const reviewService = new ReviewService()

// GET /api/v1/reviews/:videoId/byVideo  — public
exports.getReviewsByVideo = catchAsync(async (req, res) => {
  const reviews = await reviewService.getByVideoId(req.params.videoId)

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  })
})

// GET /api/v1/reviews/:channelId/numReviews  — public
exports.getNumReviews = catchAsync(async (req, res) => {
  const numReviews = await reviewService.countByChannel(req.params.channelId)

  res.status(200).json({
    status: 'success',
    data: { numReviews }
  })
})

// POST /api/v1/reviews  — authenticated ('user')
exports.createReview = catchAsync(async (req, res) => {
  const doc = await reviewService.createReview(req.body)

  res.status(201).json({
    status: 'success',
    data: doc
  })
})

// Attach the authenticated user (id + name) to the review before creating.
exports.setReviewUserId = (req, res, next) => {
  if (!req.body.user && req.user) {
    req.body.user = {
      userId: req.user.userId || req.user.id || req.user._id,
      name: req.user.name
    }
  }
  next()
}

// Admin-only single-item operations are not yet ported to DynamoDB.
exports.getOne = catchAsync(async (req, res, next) =>
  next(new AppError('Not implemented', 501))
)
exports.getAllReviews = catchAsync(async (req, res, next) =>
  next(new AppError('Not implemented', 501))
)
exports.updateOne = catchAsync(async (req, res, next) =>
  next(new AppError('Not implemented', 501))
)
exports.deleteOne = catchAsync(async (req, res, next) =>
  next(new AppError('Not implemented', 501))
)
