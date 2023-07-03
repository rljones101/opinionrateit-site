const express = require('express')
const stripeController = require('../controllers/stripeController.js')

const router = express.Router()

router.route('/create-intent').post(stripeController.createIntent)
router
  .route('/webhook')
  .post(express.raw({ type: 'application/json' }), stripeController.stripeWebHook)

module.exports = router
