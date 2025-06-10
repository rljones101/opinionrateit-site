const factory = require('./handlerFactory.js')
const Reviewer = require('../models/reviewerModel.js')
const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')

exports.getAllReviewers = factory.getAll(Reviewer)
exports.getOne = factory.getOne(Reviewer)
exports.createReviewer = factory.createOne(Reviewer)
exports.updateOne = factory.updateOne(Reviewer)
exports.deleteOne = factory.deleteOne(Reviewer)

exports.getReviewerChannel = catchAsync(async (req, res, next) => {
  let query = Reviewer.findOne({ channelId: req.params.channelId }).populate('user')
  const doc = await query

  if (!doc) {
    return next(new AppError('No document found with that channel ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: doc
  })
})
