const express = require('express')
const reviewController = require('../controllers/reviewController.js')
const authController = require('../controllers/authController.js')

const reviewRoutes = express.Router()

// Public reads — logged-out visitors can see reviews/comments on a video.
// Being able to read them (and see the "sign in to review" prompt) is what
// encourages sign-up.
reviewRoutes.route('/:videoId/byVideo').get(reviewController.getReviewsByVideo)
reviewRoutes.route('/:channelId/numReviews').get(reviewController.getNumReviews)

// Everything below requires authentication.
reviewRoutes.use(authController.protect)

reviewRoutes
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setReviewUserId,
    reviewController.createReview
  )

reviewRoutes
  .route('/:id')
  .get(reviewController.getOne)
  .patch(authController.restrictTo('admin'), reviewController.updateOne)
  .delete(authController.restrictTo('admin'), reviewController.deleteOne)

module.exports = reviewRoutes
