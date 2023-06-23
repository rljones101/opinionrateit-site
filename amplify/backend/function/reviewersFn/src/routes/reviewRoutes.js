const express = require('express')
const reviewController = require('../controllers/reviewController.js')
const authController = require('../controllers/authController.js')

const reviewRoutes = express.Router()

reviewRoutes.use(authController.protect)

reviewRoutes
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setReviewUserId,
    reviewController.createReview
  )

reviewRoutes.route('/:videoId/byVideo').get(reviewController.getReviewsByVideo)

reviewRoutes
  .route('/:id')
  .get(reviewController.getOne)
  .patch(authController.restrictTo('admin'), reviewController.updateOne)
  .delete(authController.restrictTo('admin'), reviewController.deleteOne)

module.exports = reviewRoutes
