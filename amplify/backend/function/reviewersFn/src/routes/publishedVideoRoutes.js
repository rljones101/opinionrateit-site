const express = require('express')
const publishedVideoController = require('../controllers/publishedVideoController.js')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router.route('/').get(publishedVideoController.getAll).get(publishedVideoController.getOne)

router.route('/search').get(publishedVideoController.search)

router.use(authController.restrictTo('reviewer-basic', 'reviewer-plus', 'admin'))

router.route('/').post(publishedVideoController.createMultiple)

router
  .route('/:id')
  .patch(publishedVideoController.updateOne)
  .delete(publishedVideoController.deleteOne)

module.exports = router
