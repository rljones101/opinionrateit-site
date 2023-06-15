const express = require('express')
const reviewController = require('../controllers/reviewController.js')

const reviewRoutes = express.Router()

reviewRoutes.route('/').get(reviewController.getAllReviews).post(reviewController.createReview)

reviewRoutes.route('/:videoId/byVideo').get(reviewController.getReviewsByVideo)

reviewRoutes
  .route('/:id')
  .get(reviewController.getOne)
  .patch(reviewController.updateOne)
  .delete(reviewController.deleteOne)

module.exports = reviewRoutes
