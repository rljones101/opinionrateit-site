const express = require('express')
const publishedVideoController = require('../controllers/publishedVideoController.js')
const authController = require('../controllers/authController.dynamo.js')

const router = express.Router()

// Public reads — anyone can browse the published video catalog.
router.route('/').get(publishedVideoController.getAll)
router.route('/search').get(publishedVideoController.search)
router.route('/:id').get(publishedVideoController.getOne)

// Everything below requires an authenticated reviewer/admin.
router.use(authController.protect)
router.use(authController.restrictTo('reviewer-basic', 'reviewer-plus', 'creator', 'admin'))

router.route('/').post(publishedVideoController.createMultiple)

router
  .route('/:id')
  .patch(publishedVideoController.updateOne)
  .delete(publishedVideoController.deleteOne)

module.exports = router
