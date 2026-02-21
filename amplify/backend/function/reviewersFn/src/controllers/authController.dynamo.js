const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const tokenUtils = require('../utils/tokenUtils.js')
const serviceFactory = require('../services/ServiceFactory')

const createSendToken = async (user, statusCode, res, req) => {
  const token = tokenUtils.signToken(user.userId)
  const refreshToken = tokenUtils.signRefreshToken(user.userId)

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

  // Create session record
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown'
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown'
    
    // TODO: Implement session service
    // await sessionService.createSession(user.userId, token, userAgent, ipAddress)
    console.log('Session creation not yet implemented for DynamoDB')
  } catch (error) {
    console.error('Failed to create session:', error)
    // Don't block login if session creation fails
  }

  // Remove password from response
  const { password, ...userResponse } = user

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: userResponse
    }
  })
}

exports.signup = catchAsync(async (req, res) => {
  console.log('DynamoDB Signup attempt for:', req.body.email)
  
  const userService = serviceFactory.getUserService()
  const role = req.body.role || 'user'

  // Tier-specific validation
  if (role === 'creator' && !req.body.youTubeChannelId) {
    throw new AppError('YouTube channel is required for Creator tier', 400)
  }

  if ((role === 'basic' || role === 'creator') && !req.body.stripeCustomerId) {
    throw new AppError('Billing information is required for this tier', 400)
  }

  // Determine active status based on tier
  const active = role === 'free' ? true : false

  // Create user
  let user = await userService.createUser({
    youTubeChannelId: req.body.youTubeChannelId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: role,
    active: active,
    stripeCustomerId: req.body.stripeCustomerId
  })

  console.log('User created successfully:', user.email)

  // Create reviewer profile for Creator tier
  if (role === 'creator') {
    // TODO: Implement reviewer service for DynamoDB
    console.log('Reviewer creation not yet implemented for DynamoDB')
  }

  // TODO: Log signup activity
  console.log('Activity logging not yet implemented for DynamoDB')

  await createSendToken(user, 201, res, req)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  console.log('DynamoDB Login attempt for email:', email)

  const userService = serviceFactory.getUserService()

  // 2) Check if the user exists and password is correct
  try {
    const user = await userService.getUserWithPassword(email.trim())
    console.log('User found:', user ? 'YES' : 'NO')

    if (!user) {
      console.log('User not found')
      return next(new AppError('Incorrect email or password', 401))
    }

    console.log('Checking password...')
    const passwordMatch = await userService.comparePassword(password, user.password)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      console.log('Password does not match')
      return next(new AppError('Incorrect email or password', 401))
    }

    console.log('Login successful, creating token...')

    // TODO: Handle reviewer data for DynamoDB
    if (['reviewer-basic', 'reviewer-plus'].includes(user.role)) {
      console.log('Reviewer data loading not yet implemented for DynamoDB')
    }

    // TODO: Log login activity
    console.log('Login activity logging not yet implemented for DynamoDB')

    await createSendToken(user, 200, res, req)
  } catch (error) {
    console.error('Login error:', error)
    return next(new AppError('Login failed', 500))
  }
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/api/v1/users/refresh-token'
  })
  res.status(200).json({ status: 'success' })
}

exports.protect = catchAsync(async (req, res, next) => {
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

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const userService = serviceFactory.getUserService()
  const currentUser = await userService.getUserById(decoded.id)
  
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401))
  }

  // 4) Check if user changed password after the token was issued
  if (userService.changedPasswordAfter(currentUser, decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }

  // Grant access to protected route
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // TODO: Implement forgot password for DynamoDB
  return next(new AppError('Forgot password not yet implemented for DynamoDB', 501))
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // TODO: Implement reset password for DynamoDB
  return next(new AppError('Reset password not yet implemented for DynamoDB', 501))
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const userService = serviceFactory.getUserService()

  // 1) Get user from collection
  const user = await userService.getUserById(req.user.userId)
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  // 2) Check if POSTed current password is correct
  const { passwordCurrent, password, passwordConfirm } = req.body

  if (!passwordCurrent || !password || !passwordConfirm) {
    return next(new AppError('Please provide current password, new password, and password confirmation', 400))
  }

  if (password !== passwordConfirm) {
    return next(new AppError('New password and confirmation do not match', 400))
  }

  // 3) Update password
  const updatedUser = await userService.updatePassword(req.user.userId, passwordCurrent, password)

  // 4) Log user in, send JWT
  await createSendToken(updatedUser, 200, res, req)
})

// Middleware to check if we should use DynamoDB or MongoDB
exports.useDynamoDB = (req, res, next) => {
  if (process.env.USE_DYNAMODB === 'true') {
    // Use DynamoDB controller methods
    req.useDynamoDB = true
  }
  next()
}