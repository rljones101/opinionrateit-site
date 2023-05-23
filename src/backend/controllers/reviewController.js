const factory = require('./handlerFactory')
const Review = require('../models/reviewModel')

exports.getAllReviews = factory.getAll(Review)