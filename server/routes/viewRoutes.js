import express from 'express'

import { getReviewers } from '../controllers/viewController.js'

const viewRoutes = express.Router()

viewRoutes.route('/').get(getReviewers)

export { viewRoutes }