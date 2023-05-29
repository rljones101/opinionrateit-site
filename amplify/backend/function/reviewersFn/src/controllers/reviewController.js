const factory = require('./handlerFactory.js')
const Review = require('../models/reviewModel.js')

exports.getAllReviews = factory.getAll(Review)
