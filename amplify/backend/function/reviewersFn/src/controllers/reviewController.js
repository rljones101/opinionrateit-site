const factory = require('./handlerFactory.js')
const Review = require('../models/reviewModel.js')
const catchAsync = require('../utils/catchAsync.js')

exports.getAllReviews = factory.getAll(Review)
exports.getOne = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateOne = factory.updateOne(Review)
exports.deleteOne = factory.deleteOne(Review)

exports.getReviewsByVideo = catchAsync(async (req, res) => {
  const reviews = await Review.find({ videoId: req.params.videoId }).populate('user')

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      data: reviews
    }
  })
})

exports.setReviewUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id
  next()
}
