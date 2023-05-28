import express from 'express'
import { getAllReviews } from '../controllers/reviewController.js'

const reviewRoutes = express.Router()

reviewRoutes.route('/').get(getAllReviews)

export { reviewRoutes }