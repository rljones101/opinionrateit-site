const express = require('express')
const publishedVideoController = require('../controllers/publishedVideoController.js')

const router = express.Router()

router
  .route('/')
  .get(publishedVideoController.getAll)
  .get(publishedVideoController.getOne)
  .post(publishedVideoController.createOne)

router.route('/:userId').get(publishedVideoController.getVideosByUser)

router
  .route('/:id')
  .patch(publishedVideoController.updateOne)
  .delete(publishedVideoController.deleteOne)

module.exports = router
