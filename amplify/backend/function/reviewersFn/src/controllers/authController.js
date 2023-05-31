const catchAsSync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const tokenUtils = require('../utils/tokenUtils.js')
const User = require('../models/userModel.js')

const createAndSendToken = (user, statusCode, res) => {
  const token = tokenUtils.signToken(user._id)
  const cookieOptions = {
    expires: new Date((Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60) ^ (60 * 1000)),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  // remove the password from the output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

exports.signup = catchAsSync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  })

  createAndSendToken(user, 201, res)
})

exports.login = catchAsSync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // 2) Check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  // 3) If everything is ok, send token to client
  createAndSendToken(user, 200, res)
})
