const mongoose = require('mongoose')

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Activity must belong to a user'],
    index: true
  },
  
  type: {
    type: String,
    enum: ['review', 'video_view', 'profile_update', 'login', 'signup'],
    required: [true, 'Activity must have a type'],
    index: true
  },
  
  title: {
    type: String,
    required: [true, 'Activity must have a title']
  },
  
  description: {
    type: String
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// Compound indexes for efficient queries
userActivitySchema.index({ userId: 1, timestamp: -1 })
userActivitySchema.index({ userId: 1, type: 1, timestamp: -1 })

// Static method to log activity
userActivitySchema.statics.logActivity = async function(userId, type, title, description, metadata) {
  try {
    await this.create({
      userId,
      type,
      title,
      description,
      metadata
    })
  } catch (error) {
    // Log error but don't throw - activity logging shouldn't break main flow
    console.error('Failed to log activity:', error)
  }
}

// Static method to get activity stats
userActivitySchema.statics.getStats = async function(userId) {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const [totalReviews, totalVideoViews, thisWeekActivity] = await Promise.all([
    this.countDocuments({ userId, type: 'review' }),
    this.countDocuments({ userId, type: 'video_view' }),
    this.countDocuments({ userId, timestamp: { $gte: oneWeekAgo } })
  ])
  
  return {
    totalReviews,
    totalVideoViews,
    thisWeekActivity
  }
}

const UserActivity = mongoose.model('UserActivity', userActivitySchema)

module.exports = UserActivity
