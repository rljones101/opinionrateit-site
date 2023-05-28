import express from 'express'
import { getAllReviewers } from '../controllers/reviewerController.js'

const reviewerRoutes = express.Router()

reviewerRoutes.route('/').get(getAllReviewers)

export { reviewerRoutes }