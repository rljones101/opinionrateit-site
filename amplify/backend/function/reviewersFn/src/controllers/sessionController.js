const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const SessionService = require('../services/dynamodb/SessionService')

const sessionService = new SessionService()

// Resolve the raw JWT from the request (Authorization header or cookie).
function getRequestToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1]
  }
  return req.cookies.jwt
}

function userId(req) {
  return req.user.userId || req.user.id
}

// GET /api/v1/users/me/sessions
exports.getSessions = catchAsync(async (req, res) => {
  const sessions = await sessionService.listForUser(userId(req))

  // Identify the current session by the request token's hash.
  const token = getRequestToken(req)
  const currentHash = token ? SessionService.hashToken(token) : null

  const formatted = sessions.map((s) => ({
    id: s.sessionId,
    device: s.device,
    browser: s.browser,
    os: s.os,
    location: s.location,
    ipAddress: s.ipAddress,
    lastActive: s.lastActive,
    createdAt: s.createdAt,
    current: false
  }))

  // listForUser's format() strips tokenHash, so re-fetch raw to match current.
  if (currentHash) {
    const current = await sessionService.findByToken(token)
    if (current) {
      const idx = formatted.findIndex((f) => f.id === current.sessionId)
      if (idx !== -1) formatted[idx].current = true
    }
  }

  res.status(200).json({
    status: 'success',
    data: { sessions: formatted }
  })
})

// DELETE /api/v1/users/me/sessions/:sessionId
exports.revokeSession = catchAsync(async (req, res, next) => {
  const uid = userId(req)
  const session = await sessionService.getById(uid, req.params.sessionId)

  if (!session) {
    return next(new AppError('Session not found', 404))
  }

  // Don't allow revoking the current session (use logout instead).
  const token = getRequestToken(req)
  if (token && SessionService.hashToken(token) === session.tokenHash) {
    return next(new AppError('Cannot revoke your current session. Use logout instead.', 400))
  }

  await sessionService.revoke(uid, req.params.sessionId)

  res.status(200).json({
    status: 'success',
    message: 'Session revoked successfully'
  })
})

// DELETE /api/v1/users/me/sessions  (revoke all except current)
exports.revokeAllSessions = catchAsync(async (req, res, next) => {
  const token = getRequestToken(req)
  if (!token) {
    return next(new AppError('No active session found', 400))
  }

  const revoked = await sessionService.revokeAllExcept(
    userId(req),
    SessionService.hashToken(token)
  )

  res.status(200).json({
    status: 'success',
    message: `${revoked} other session(s) revoked successfully`
  })
})
