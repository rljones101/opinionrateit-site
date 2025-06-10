const express = require('express')
const reviewerController = require('../controllers/reviewerController.js')
// const authController = require('../controllers/authController')
const publishedVideoController = require('../controllers/publishedVideoController.js')

const reviewerRoutes = express.Router()

reviewerRoutes.route('/').get(reviewerController.getAllReviewers)
reviewerRoutes.route('/:channelId').get(reviewerController.getReviewerChannel)
reviewerRoutes.route('/:channelId/publishedVideos').get(publishedVideoController.getVideosByChannel)

module.exports = reviewerRoutes
