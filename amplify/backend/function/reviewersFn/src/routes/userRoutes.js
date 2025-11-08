const express = require('express')
const rateLimit = require('express-rate-limit')
const authController = require('../controllers/authController.js')
const userController = require('../controllers/userController.js')
const { validateSignup, validateLogin, validatePasswordReset } = require('../middleware/validation.js')

const router = express.Router()

// Auth rate limiting
const authLimiter = rateLimit({
  max: 5, // limit each IP to 5 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})

// Apply auth rate limiting to these routes
router.post('/signup', authLimiter, validateSignup, authController.signup)
router.post('/login', authLimiter, validateLogin, authController.login)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authLimiter, validatePasswordReset, authController.forgotPassword)
router.get('/me', authController.protect, authController.getMe)

router.use(authController.protect)
router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getAll)
router.route('/:id').delete(userController.deleteUser)

module.exports = router
