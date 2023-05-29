const express =  require('express')
const reviewerController =  require('../controllers/reviewerController.js')

const reviewRoutes = express.Router()

reviewRoutes.route('/').get(reviewerController.getAllReviewers)

module.exports = reviewRoutes