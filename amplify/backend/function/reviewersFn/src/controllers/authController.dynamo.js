const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const tokenUtils = require('../utils/tokenUtils.js')
const serviceFactory = require('../services/ServiceFactory')
const SessionService = require('../services/dynamodb/SessionService.js')
const ReviewerService = require('../services/dynamodb/ReviewerService.js')

const sessionService = new SessionService()
const reviewerService = new ReviewerService()

// Lazily construct the Google OAuth client so a missing GOOGLE_CLIENT_ID only
// fails the Google route (with a clear message), not the whole module.
let googleClient = null
const getGoogleClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) return null
  if (!googleClient) googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  return googleClient
}

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
    await sessionService.createSession(user.userId, token, userAgent, ipAddress)
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

  // Create reviewer profile for Creator tier (and legacy reviewer roles)
  if (['creator', 'reviewer-basic', 'reviewer-plus'].includes(role) && req.body.youTubeChannelId) {
    try {
      const reviewer = await reviewerService.createReviewer({
        user: user.userId,
        channelId: req.body.youTubeChannelId,
        name: req.body.title || user.name,
        avatar: req.body.avatar,
        description: req.body.description
      })
      user = { ...user, avatar: reviewer.avatar }
    } catch (err) {
      console.error('Failed to create reviewer profile:', err.message)
      // Don't block signup if reviewer creation fails
    }
  }

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

    // Attach the reviewer avatar for reviewer/creator roles.
    if (['reviewer-basic', 'reviewer-plus', 'creator'].includes(user.role) && user.youTubeChannelId) {
      try {
        const reviewer = await reviewerService.getByChannelId(user.youTubeChannelId)
        if (reviewer) user.avatar = reviewer.avatar
      } catch (err) {
        console.error('Failed to load reviewer data:', err.message)
      }
    }

    await createSendToken(user, 200, res, req)
  } catch (error) {
    console.error('Login error:', error)
    return next(new AppError('Login failed', 500))
  }
})

/**
 * Google sign-in / sign-up.
 *
 * The frontend obtains a Google ID token (JWT) via Google Identity Services
 * and POSTs it here as { credential }. We verify the token with Google, then:
 *   - existing Google user (matched by email) -> log in
 *   - existing email/password user (same verified email) -> link + log in
 *   - no user -> create a password-less Free account
 * In all cases we finish with createSendToken so the cookie + session contract
 * is identical to normal login.
 */
exports.googleAuth = catchAsync(async (req, res, next) => {
  const client = getGoogleClient()
  if (!client) {
    return next(
      new AppError('Google sign-in is not configured on the server (missing GOOGLE_CLIENT_ID).', 503)
    )
  }

  const { credential } = req.body
  if (!credential) {
    return next(new AppError('Missing Google credential', 400))
  }

  // 1) Verify the ID token (signature, audience, expiry) with Google.
  let payload
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    payload = ticket.getPayload()
  } catch (err) {
    console.error('Google token verification failed:', err.message)
    return next(new AppError('Invalid Google credential', 401))
  }

  // 2) Require a verified email (we match/link accounts by email).
  if (!payload || !payload.email || payload.email_verified === false) {
    return next(new AppError('Google account email is not verified', 401))
  }

  const email = payload.email.toLowerCase()
  const googleId = payload.sub
  const name = payload.name || email.split('@')[0]
  const avatar = payload.picture || null

  const userService = serviceFactory.getUserService()

  // 3) Find-or-create / link.
  let user = await userService.getUserByEmail(email)
  if (user) {
    // Existing account with this (Google-verified) email: link the Google id
    // if it isn't already recorded, then log in.
    if (user.googleId !== googleId) {
      try {
        user = await userService.linkGoogleAccount(user.userId, googleId)
      } catch (err) {
        console.error('Failed to link Google account:', err.message)
      }
    }
  } else {
    user = await userService.createOAuthUser({ name, email, googleId, avatar })
  }

  // 4) Issue cookies + session exactly like a normal login.
  const statusCode = 200
  await createSendToken(user, statusCode, res, req)
})

exports.logout = catchAsync(async (req, res) => {
  // Revoke the current session so the token can't be reused.
  const token = req.cookies.jwt
  if (token && token !== 'loggedout') {
    try {
      const session = await sessionService.findByToken(token)
      if (session) {
        await sessionService.revoke(session.userId, session.sessionId)
      }
    } catch (err) {
      console.error('Failed to revoke session on logout:', err.message)
    }
  }

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
})

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

  try {
    // 2) Verify the token (invalid/expired/loggedout tokens land in catch → 401)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if the user still exists
    const userService = serviceFactory.getUserService()
    const currentUser = await userService.getUserById(decoded.id)

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }

    // 4) Check if the user changed password after the token was issued
    if (userService.changedPasswordAfter(currentUser, decoded.iat)) {
      return next(new AppError('User recently changed password! Please log in again.', 401))
    }

    // 5) The session must still exist and not be expired. A token whose session
    //    was revoked (logout / revoke) or has expired must be rejected —
    //    otherwise a still-valid JWT would outlive its session.
    const session = await sessionService.findByToken(token)
    if (!session) {
      return next(new AppError('Your session is no longer valid. Please log in again.', 401))
    }
    if (sessionService.isExpired(session)) {
      return next(new AppError('Your session has expired. Please log in again.', 401))
    }
    // Best-effort activity bump (don't await).
    sessionService.touch(session)

    // Grant access to protected route
    req.user = currentUser
    next()
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401))
  }
})

exports.getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  })
}

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 401))
  }

  try {
    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET)
    const userService = serviceFactory.getUserService()
    const currentUser = await userService.getUserById(decoded.id)

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401))
    }

    if (userService.changedPasswordAfter(currentUser, decoded.iat)) {
      return next(new AppError('User recently changed password! Please login again', 401))
    }

    await createSendToken(currentUser, 200, res, req)
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401))
  }
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