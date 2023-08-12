const express = require('express')
const stripeController = require('../controllers/stripeController.js')

const router = express.Router()

router.route('/create-customer').post(stripeController.createCustomer)
router.route('/create-intent').post(stripeController.createIntent)

module.exports = router
