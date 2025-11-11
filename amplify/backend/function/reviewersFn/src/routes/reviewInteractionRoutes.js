const express = require('express')
const reviewInteractionController = require('../controllers/reviewInteractionController')
const authController = require('../controllers/authController')

const router = express.Router()

// Protect all routes
router.use(authController.protect)

// Review likes
router
  .route('/:reviewId/like')
  .post(reviewInteractionController.likeReview)
  .delete(reviewInteractionController.unlikeReview)

// Review replies
router
  .route('/:reviewId/replies')
  .get(reviewInteractionController.getReplies)
  .post(reviewInteractionController.addReply)

router
  .route('/:reviewId/replies/:replyId')
  .delete(reviewInteractionController.deleteReply)

module.exports = router
