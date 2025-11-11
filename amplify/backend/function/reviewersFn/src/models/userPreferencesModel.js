const mongoose = require('mongoose')

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Preferences must belong to a user'],
    unique: true,
    index: true
  },
  
  // Notification preferences
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    reviews: { type: Boolean, default: true },
    videoUpdates: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false }
  },
  
  // Display preferences
  display: {
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'auto'], 
      default: 'auto' 
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' }
  },
  
  // Privacy preferences
  privacy: {
    profileVisibility: { 
      type: String, 
      enum: ['public', 'members', 'private'], 
      default: 'public' 
    },
    showEmail: { type: Boolean, default: false },
    showActivity: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true }
  },
  
  // Content preferences
  content: {
    autoplayVideos: { type: Boolean, default: true },
    showMatureContent: { type: Boolean, default: false },
    defaultVideoQuality: { type: String, default: 'auto' },
    subtitlesEnabled: { type: Boolean, default: false }
  },
  
  // Security settings
  security: {
    loginNotifications: { type: Boolean, default: true },
    suspiciousActivityAlerts: { type: Boolean, default: true },
    passwordExpiry: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 } // days, 0 = never
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update timestamp on save
userPreferencesSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Static method to get or create default preferences
userPreferencesSchema.statics.getOrCreate = async function(userId) {
  let preferences = await this.findOne({ userId })
  
  if (!preferences) {
    preferences = await this.create({ userId })
  }
  
  return preferences
}

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema)

module.exports = UserPreferences
