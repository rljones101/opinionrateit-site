const express = require('express')
const bookmarkController = require('../controllers/bookmarkController')
const authController = require('../controllers/authController')

const router = express.Router()

// Protect all routes
router.use(authController.protect)

router
  .route('/')
  .get(bookmarkController.getBookmarks)
  .post(bookmarkController.addBookmark)

router
  .route('/:bookmarkId')
  .delete(bookmarkController.removeBookmark)

router
  .route('/video/:videoId')
  .delete(bookmarkController.removeBookmarkByVideoId)

module.exports = router
