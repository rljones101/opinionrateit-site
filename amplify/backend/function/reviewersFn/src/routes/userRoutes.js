const express = require('express')
const authController = require('../controllers/authController.js')
const userController = require('../controllers/userController.js')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.route('/').get(userController.getAll)
router.route('/:id').delete(userController.deleteUser)

module.exports = router
