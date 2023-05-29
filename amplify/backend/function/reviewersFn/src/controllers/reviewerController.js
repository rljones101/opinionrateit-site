const factory = require('./handlerFactory.js')
const Reviewer = require('../models/reviewerModel.js')

exports.getAllReviewers = factory.getAll(Reviewer)
exports.getOne = factory.getOne(Reviewer)
exports.createReviewer = factory.createOne(Reviewer)
exports.updateOne = factory.updateOne(Reviewer)
exports.deleteOne = factory.deleteOne(Reviewer)