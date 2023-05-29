const express =  require('express')
const reviewController =  require('../controllers/reviewController.js')

const reviewRoutes = express.Router()

reviewRoutes.route('/').get(reviewController.getAllReviews)

module.exports = reviewRoutes