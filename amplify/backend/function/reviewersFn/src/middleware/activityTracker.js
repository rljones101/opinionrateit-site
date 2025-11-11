const UserActivity = require('../models/userActivityModel')

/**
 * Generic activity tracker middleware
 * @param {string} type - Activity type (review, video_view, profile_update, login, signup)
 * @param {object} options - Configuration options
 * @param {function} options.title - Function to extract title from req
 * @param {function} options.description - Function to extract description from req
 * @param {function} options.metadata - Function to extract metadata from req
 */
exports.trackActivity = (type, options = {}) => {
  return async (req, res, next) => {
    // Skip if no user (shouldn't happen on protected routes)
    if (!req.user) return next()
    
    try {
      const title = typeof options.title === 'function' 
        ? options.title(req) 
        : options.title || `${type} activity`
      
      const description = typeof options.description === 'function'
        ? options.description(req)
        : options.description || ''
      
      const metadata = typeof options.metadata === 'function'
        ? options.metadata(req)
        : options.metadata || {}
      
      // Log activity asynchronously (don't wait)
      UserActivity.logActivity(req.user.id, type, title, description, metadata)
        .catch(err => console.error('Activity tracking error:', err))
      
      next()
    } catch (error) {
      // Don't block request if activity tracking fails
      console.error('Activity tracking middleware error:', error)
      next()
    }
  }
}

/**
 * Track profile update activity
 */
exports.trackProfileUpdate = exports.trackActivity('profile_update', {
  title: (req) => 'Updated profile',
  description: (req) => {
    const fields = Object.keys(req.body).filter(k => k !== 'password' && k !== 'passwordConfirm')
    return `Updated: ${fields.join(', ')}`
  },
  metadata: (req) => ({
    updatedFields: Object.keys(req.body).filter(k => k !== 'password' && k !== 'passwordConfirm')
  })
})

/**
 * Track login activity
 */
exports.trackLogin = exports.trackActivity('login', {
  title: (req) => 'Logged in',
  description: (req) => {
    const userAgent = req.headers['user-agent'] || 'Unknown device'
    return `Login from ${userAgent.substring(0, 50)}`
  },
  metadata: (req) => ({
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  })
})

/**
 * Track signup activity
 */
exports.trackSignup = exports.trackActivity('signup', {
  title: (req) => 'Account created',
  description: (req) => 'Welcome to OpinionRateIt!',
  metadata: (req) => ({
    ipAddress: req.ip || req.connection.remoteAddress
  })
})

/**
 * Helper function to manually log activity from controllers
 */
exports.logActivity = async (userId, type, title, description, metadata) => {
  return UserActivity.logActivity(userId, type, title, description, metadata)
}
