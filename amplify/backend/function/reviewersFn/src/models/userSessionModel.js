const mongoose = require('mongoose')

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Session must belong to a user'],
    index: true
  },
  
  token: {
    type: String,
    required: [true, 'Session must have a token'],
    unique: true,
    select: false
  },
  
  device: {
    type: String,
    required: true,
    default: 'Unknown Device'
  },
  
  browser: {
    type: String,
    required: true,
    default: 'Unknown Browser'
  },
  
  os: {
    type: String,
    default: 'Unknown OS'
  },
  
  location: {
    type: String,
    default: 'Unknown Location'
  },
  
  ipAddress: {
    type: String,
    required: true
  },
  
  lastActive: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: {
    type: Date,
    index: true
  }
})

// Auto-delete expired sessions using TTL index
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Compound index for efficient user session queries
userSessionSchema.index({ userId: 1, lastActive: -1 })

// Update lastActive timestamp
userSessionSchema.methods.updateActivity = function() {
  this.lastActive = Date.now()
  return this.save()
}

// Check if session is expired
userSessionSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false
  return Date.now() > this.expiresAt.getTime()
}

// Static method to create session
userSessionSchema.statics.createSession = async function(userId, token, userAgent, ipAddress) {
  const UAParser = require('ua-parser-js')
  const parser = new UAParser(userAgent)
  const ua = parser.getResult()
  
  // Calculate expiration (30 days default)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)
  
  const session = await this.create({
    userId,
    token,
    device: ua.device.model || ua.device.type || 'Desktop',
    browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
    os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim(),
    ipAddress,
    expiresAt
  })
  
  return session
}

// Static method to find session by token
userSessionSchema.statics.findByToken = async function(token) {
  return this.findOne({ token }).select('+token')
}

const UserSession = mongoose.model('UserSession', userSessionSchema)

module.exports = UserSession
