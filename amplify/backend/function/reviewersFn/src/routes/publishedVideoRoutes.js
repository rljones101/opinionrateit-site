const express = require('express')
const publishedVideoController = require('../controllers/publishedVideoController.js')

const router = express.Router()

router
  .route('/')
  .get(publishedVideoController.getAll)
  .get(publishedVideoController.getOne)
  .post(publishedVideoController.createMultiple)

router.route('/user/:userId').get(publishedVideoController.getVideosByUser)
router.route('/channel/:channelId').get(publishedVideoController.getVideosByChannel)

router
  .route('/:id')
  .patch(publishedVideoController.updateOne)
  .delete(publishedVideoController.deleteOne)

module.exports = router
