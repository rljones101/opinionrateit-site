const { body, validationResult } = require('express-validator')
const AppError = require('../utils/appError')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    return next(new AppError(errorMessages.join('. '), 400))
  }
  next()
}

const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    // Allow letters, numbers, spaces, and common name punctuation
    // (apostrophes, hyphens, periods) — e.g. "test1", "O'Brien", "Jean-Luc".
    .matches(/^[\p{L}\p{N} .'-]+$/u)
    .withMessage('Name contains invalid characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 40 })
    .withMessage('Email must be less than 40 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
  
  body('role')
    .optional()
    .isIn(['free', 'basic', 'creator', 'user', 'reviewer-basic', 'reviewer-plus', 'admin'])
    .withMessage('Invalid role specified'),
  
  body('youTubeChannelId')
    // `checkFalsy` so an empty string (sent by Free/Basic signups) is treated
    // as "not provided" and skips the length check. Creator-tier requirement is
    // enforced in the auth controller.
    .optional({ checkFalsy: true })
    .isLength({ min: 10, max: 50 })
    .withMessage('YouTube Channel ID must be between 10 and 50 characters'),
  
  handleValidationErrors
]

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
]

const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  handleValidationErrors
]

module.exports = {
  validateSignup,
  validateLogin,
  validatePasswordReset,
  handleValidationErrors
}