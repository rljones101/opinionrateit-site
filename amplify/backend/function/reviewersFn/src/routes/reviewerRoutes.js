const express = require('express')
const reviewerController = require('../controllers/reviewerController.js')

const reviewerRoutes = express.Router()

reviewerRoutes.route('/').get(reviewerController.getAllReviewers)

module.exports = reviewerRoutes