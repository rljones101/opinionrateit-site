const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const PreferencesService = require('../services/dynamodb/PreferencesService')

const preferencesService = new PreferencesService()

const uid = (req) => req.user.userId || req.user.id

// GET /api/v1/users/me/preferences
exports.getPreferences = catchAsync(async (req, res) => {
  const preferences = await preferencesService.getOrCreate(uid(req))

  res.status(200).json({
    status: 'success',
    data: { preferences }
  })
})

// PATCH /api/v1/users/me/preferences
exports.updatePreferences = catchAsync(async (req, res, next) => {
  const { notifications, display, privacy, content, security } = req.body

  // Validate enum / type constraints (same as before).
  if (display && display.theme && !['light', 'dark', 'auto'].includes(display.theme)) {
    return next(new AppError('Invalid theme value. Must be light, dark, or auto', 400))
  }
  if (
    privacy &&
    privacy.profileVisibility &&
    !['public', 'members', 'private'].includes(privacy.profileVisibility)
  ) {
    return next(new AppError('Invalid profile visibility. Must be public, members, or private', 400))
  }
  if (
    security &&
    security.sessionTimeout !== undefined &&
    typeof security.sessionTimeout !== 'number'
  ) {
    return next(new AppError('Session timeout must be a number', 400))
  }

  const preferences = await preferencesService.update(uid(req), {
    notifications,
    display,
    privacy,
    content,
    security
  })

  res.status(200).json({
    status: 'success',
    data: { preferences }
  })
})
