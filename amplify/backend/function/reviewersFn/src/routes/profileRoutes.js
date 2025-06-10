const express = require('express')
const authController = require('../controllers/authController.js')
const userController = require('../controllers/userController.js')

const router = express.Router()

router.use(authController.protect)

router.get('/:name', authController.protect, userController.getUserByName)

module.exports = router
