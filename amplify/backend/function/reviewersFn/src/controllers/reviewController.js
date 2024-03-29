const factory = require('./handlerFactory.js')
const Review = require('../models/reviewModel.js')
const catchAsync = require('../utils/catchAsync.js')

exports.getAllReviews = factory.getAll(Review)
exports.getOne = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateOne = factory.updateOne(Review)
exports.deleteOne = factory.deleteOne(Review)

exports.getReviewsByVideo = catchAsync(async (req, res) => {
  const reviews = await Review.find({ videoId: req.params.videoId })

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      data: reviews
    }
  })
})

exports.getNumReviews = catchAsync(async (req, res) => {
  const numReviews = await Review.countDocuments({ channelId: req.params.channelId })

  res.status(200).json({
    status: 'success',
    data: {
      numReviews
    }
  })
})

exports.setReviewUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id
  next()
}
