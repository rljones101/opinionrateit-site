const factory = require('./handlerFactory.js')
const Reviewer = require('../models/reviewerModel.js')

exports.getAllReviewers = factory.getAll(Reviewer)