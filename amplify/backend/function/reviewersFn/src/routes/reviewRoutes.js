const express = require('express')
const reviewerController = require('../controllers/reviewController.js')

const reviewRoutes = express.Router()

reviewRoutes.route('/').get(reviewerController.getAllReviews).post(reviewerController.createReview)

reviewRoutes
  .route('/:id')
  .get(reviewerController.getOne)
  .patch(reviewerController.updateOne)
  .delete(reviewerController.deleteOne)

module.exports = reviewRoutes
