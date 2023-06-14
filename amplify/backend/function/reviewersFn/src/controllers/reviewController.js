const factory = require('./handlerFactory.js')
const Review = require('../models/reviewModel.js')

exports.getAllReviews = factory.getAll(Review)
exports.getOne = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateOne = factory.updateOne(Review)
exports.deleteOne = factory.deleteOne(Review)
