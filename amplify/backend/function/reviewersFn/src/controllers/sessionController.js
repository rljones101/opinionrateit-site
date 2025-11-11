const UserSession = require('../models/userSessionModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Get all user sessions
exports.getSessions = catchAsync(async (req, res, next) => {
  const sessions = await UserSession.find({ userId: req.user.id })
    .sort({ lastActive: -1 })
    .lean()
  
  // Get current token to mark current session
  let currentToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    currentToken = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    currentToken = req.cookies.jwt
  }
  
  // Format sessions and mark current one
  const formattedSessions = sessions.map(session => ({
    id: session._id,
    device: session.device,
    browser: session.browser,
    os: session.os,
    location: session.location,
    ipAddress: session.ipAddress,
    lastActive: session.lastActive,
    createdAt: session.createdAt,
    current: false // Will be set below if it matches
  }))
  
  // Mark current session if we have a token
  if (currentToken) {
    const currentSession = await UserSession.findByToken(currentToken)
    if (currentSession) {
      const sessionIndex = formattedSessions.findIndex(
        s => s.id.toString() === currentSession._id.toString()
      )
      if (sessionIndex !== -1) {
        formattedSessions[sessionIndex].current = true
      }
    }
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      sessions: formattedSessions
    }
  })
})

// Revoke a specific session
exports.revokeSession = catchAsync(async (req, res, next) => {
  const session = await UserSession.findOne({
    _id: req.params.sessionId,
    userId: req.user.id
  })
  
  if (!session) {
    return next(new AppError('Session not found', 404))
  }
  
  // Don't allow revoking current session
  let currentToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    currentToken = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    currentToken = req.cookies.jwt
  }
  
  if (currentToken) {
    const currentSession = await UserSession.findByToken(currentToken)
    if (currentSession && currentSession._id.toString() === session._id.toString()) {
      return next(new AppError('Cannot revoke your current session. Use logout instead.', 400))
    }
  }
  
  await UserSession.findByIdAndDelete(req.params.sessionId)
  
  res.status(200).json({
    status: 'success',
    message: 'Session revoked successfully'
  })
})

// Revoke all sessions except current
exports.revokeAllSessions = catchAsync(async (req, res, next) => {
  // Get current token
  let currentToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    currentToken = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    currentToken = req.cookies.jwt
  }
  
  if (!currentToken) {
    return next(new AppError('No active session found', 400))
  }
  
  // Find current session
  const currentSession = await UserSession.findByToken(currentToken)
  if (!currentSession) {
    return next(new AppError('Current session not found', 404))
  }
  
  // Delete all sessions except current
  await UserSession.deleteMany({
    userId: req.user.id,
    _id: { $ne: currentSession._id }
  })
  
  res.status(200).json({
    status: 'success',
    message: 'All other sessions revoked successfully'
  })
})
