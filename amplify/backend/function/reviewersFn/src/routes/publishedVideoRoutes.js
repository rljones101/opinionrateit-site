const express = require('express')
const publishedVideoController = require('../controllers/publishedVideoController.js')
const authController = require('../controllers/authController.js')

const router = express.Router()

router.use(authController.protect)

router.route('/').get(publishedVideoController.getAll)

router.route('/search').get(publishedVideoController.search)

router.use(authController.restrictTo('reviewer-basic', 'reviewer-plus', 'admin'))

router.route('/').post(publishedVideoController.createMultiple)

router
  .route('/:id')
  .get(publishedVideoController.getOne)
  .patch(publishedVideoController.updateOne)
  .delete(publishedVideoController.deleteOne)

module.exports = router
