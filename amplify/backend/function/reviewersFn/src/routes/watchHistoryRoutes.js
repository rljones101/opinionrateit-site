const express = require('express')
const watchHistoryController = require('../controllers/watchHistoryController')
const authController = require('../controllers/authController')

const router = express.Router()

// Protect all routes
router.use(authController.protect)

router
  .route('/')
  .get(watchHistoryController.getWatchHistory)
  .post(watchHistoryController.trackWatch)
  .delete(watchHistoryController.clearHistory)

router
  .route('/video/:videoId')
  .get(watchHistoryController.getLastPosition)

router
  .route('/:historyId')
  .delete(watchHistoryController.removeHistoryItem)

module.exports = router
