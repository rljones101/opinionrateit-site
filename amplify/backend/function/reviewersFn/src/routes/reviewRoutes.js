const express =  require('express')
const reviewerController =  require('../controllers/reviewerController.js')

const reviewRoutes = express.Router()

reviewRoutes.route('/')
    .get(reviewerController.getAllReviewers)
    .get(reviewerController.getOne)
    .post(reviewerController.createReviewer)

reviewRoutes.route('/:id')
    .patch(reviewerController.updateOne)
    .delete(reviewerController.deleteOne)

module.exports = reviewRoutes