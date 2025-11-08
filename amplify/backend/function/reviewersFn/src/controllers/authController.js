const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const catchAsSync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const tokenUtils = require('../utils/tokenUtils.js')
const User = require('../models/userModel.js')
const Reviewer = require('../models/reviewerModel.js')

const createAndSendToken = (user, statusCode, res) => {
  const token = tokenUtils.signToken(user._id)
  const refreshToken = tokenUtils.signRefreshToken(user._id)
  
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/'
  }

  const refreshCookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/api/v1/users/refresh-token'
  }

  res.cookie('jwt', token, cookieOptions)
  res.cookie('refreshToken', refreshToken, refreshCookieOptions)

  // remove the password from the output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    data: {
      user
    }
  })
}

exports.signup = catchAsSync(async (req, res) => {
  // save user
  let user = await User.create({
    youTubeChannelId: req.body.youTubeChannelId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    active: req.body.active
  })

  if (['reviewer-basic', 'reviewer-plus'].includes(req.body.role)) {
    // save reviewer
    const reviewer = await Reviewer.create({
      user: user._id,
      name: req.body.title,
      channelId: req.body.youTubeChannelId,
      avatar: req.body.avatar,
      description: req.body.description
    })

    user = { ...user.toObject(), avatar: reviewer.avatar }
  }

  createAndSendToken(user, 201, res)
})

exports.login = catchAsSync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // 2) Check if the user exists and password is correct
  try {
    console.log(User.db)
    let user = await User.findOne({ email: email.trim() }).select('+password').exec()
    console.log('user is:', user)

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401))
    }

    if (['reviewer-basic', 'reviewer-plus'].includes(user.role)) {
      const reviewer = await Reviewer.findOne({ channelId: user.youTubeChannelId })
      if (reviewer) {
        user = { ...user.toObject(), avatar: reviewer.avatar }
      }
    }

    // 3) If everything is ok, send token to client
    createAndSendToken(user, 200, res)

  } catch (error) {
    return next(new AppError(`Could not find user with email: ${email}, Error: ${error}`, 401))
  }
})

exports.forgotPassword = catchAsSync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    })
  } catch (err) {}
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({ status: 'success' })
}

exports.refreshToken = catchAsSync(async (req, res, next) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 401))
  }

  try {
    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET)
    const currentUser = await User.findById(decoded.id)
    
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401))
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please login again', 401))
    }

    createAndSendToken(currentUser, 200, res)
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401))
  }
})

exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  })
}

exports.protect = catchAsSync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401))
  }
  
  try {
    // 2) Validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if the user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401))
    }

    // 4) check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please login again', 401))
    }
    
    req.user = currentUser
    next()
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401))
  }
})
