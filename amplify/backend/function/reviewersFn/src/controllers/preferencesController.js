const UserPreferences = require('../models/userPreferencesModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Get user preferences (or create with defaults if not exists)
exports.getPreferences = catchAsync(async (req, res, next) => {
  const preferences = await UserPreferences.getOrCreate(req.user.id)

  res.status(200).json({
    status: 'success',
    data: {
      preferences
    }
  })
})

// Update user preferences (partial update supported)
exports.updatePreferences = catchAsync(async (req, res, next) => {
  const { notifications, display, privacy, content, security } = req.body

  // Build update object with only provided fields
  const updateData = {}
  
  if (notifications) {
    updateData['notifications'] = {
      ...notifications
    }
  }
  
  if (display) {
    // Validate theme enum
    if (display.theme && !['light', 'dark', 'auto'].includes(display.theme)) {
      return next(new AppError('Invalid theme value. Must be light, dark, or auto', 400))
    }
    updateData['display'] = {
      ...display
    }
  }
  
  if (privacy) {
    // Validate profileVisibility enum
    if (privacy.profileVisibility && !['public', 'members', 'private'].includes(privacy.profileVisibility)) {
      return next(new AppError('Invalid profile visibility. Must be public, members, or private', 400))
    }
    updateData['privacy'] = {
      ...privacy
    }
  }
  
  if (content) {
    updateData['content'] = {
      ...content
    }
  }
  
  if (security) {
    // Validate sessionTimeout is a number
    if (security.sessionTimeout !== undefined && typeof security.sessionTimeout !== 'number') {
      return next(new AppError('Session timeout must be a number', 400))
    }
    updateData['security'] = {
      ...security
    }
  }

  // Get or create preferences first
  let preferences = await UserPreferences.findOne({ userId: req.user.id })
  
  if (!preferences) {
    // Create new preferences with provided data
    preferences = await UserPreferences.create({
      userId: req.user.id,
      ...updateData
    })
  } else {
    // Update existing preferences
    Object.keys(updateData).forEach(key => {
      if (updateData[key]) {
        preferences[key] = {
          ...preferences[key].toObject(),
          ...updateData[key]
        }
      }
    })
    
    await preferences.save()
  }

  res.status(200).json({
    status: 'success',
    data: {
      preferences
    }
  })
})
