const express = require('express')
const rateLimit = require('express-rate-limit')
const authController = require('../controllers/authController.js')
const userController = require('../controllers/userController.js')
const preferencesController = require('../controllers/preferencesController.js')
const { validateSignup, validateLogin, validatePasswordReset } = require('../middleware/validation.js')
const { uploadAvatar, handleMulterError } = require('../middleware/upload.js')
const { resizeAvatar } = require('../middleware/imageProcessor.js')

const router = express.Router()

// Auth rate limiting - disabled for development
const authLimiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 1000 : 5, // Higher limit for development
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

// Protected user profile routes
router.use(authController.protect)
router.patch('/updateMe', userController.updateMe)
router.patch('/updateMyPassword', authController.updatePassword)
router.delete('/deleteMe', userController.deleteMe)

// Avatar upload route
router.post(
  '/me/avatar',
  uploadAvatar,
  handleMulterError,
  resizeAvatar,
  userController.uploadAvatar
)

// User preferences routes
router.route('/me/preferences')
  .get(preferencesController.getPreferences)
  .patch(preferencesController.updatePreferences)

// Admin only routes
router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getAll)
router.route('/:id').delete(userController.deleteUser)

module.exports = router
