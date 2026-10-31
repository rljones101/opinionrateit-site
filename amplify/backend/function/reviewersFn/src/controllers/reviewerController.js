const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const ReviewerService = require('../services/dynamodb/ReviewerService.js')

const reviewerService = new ReviewerService()

// GET /api/v1/reviewers
exports.getAllReviewers = catchAsync(async (req, res) => {
  const doc = await reviewerService.getAll()

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc
  })
})

// GET /api/v1/reviewers/:channelId
exports.getReviewerChannel = catchAsync(async (req, res, next) => {
  const doc = await reviewerService.getByChannelId(req.params.channelId)

  if (!doc) {
    return next(new AppError('No document found with that channel ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: doc
  })
})

// POST /api/v1/reviewers
exports.createReviewer = catchAsync(async (req, res) => {
  const doc = await reviewerService.createReviewer(req.body)

  res.status(201).json({
    status: 'success',
    data: doc
  })
})

// GET /api/v1/reviewers/:channelId (single, kept for parity)
exports.getOne = exports.getReviewerChannel
