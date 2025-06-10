const express = require('express')
const youTubeController = require('../controllers/youtubeController.js')

const router = express.Router()

router.route('/').get(youTubeController.getVideosByChannel)

module.exports = router
