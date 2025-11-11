const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WatchHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Watch history must belong to a user'],
    index: true
  },
  videoId: {
    type: String,
    required: [true, 'Watch history must have a video ID'],
    index: true
  },
  watchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  watchDuration: {
    type: Number,
    required: [true, 'Watch duration is required'],
    default: 0
  },
  videoDuration: {
    type: Number,
    required: [true, 'Video duration is required']
  },
  lastPosition: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Compound index to prevent duplicate entries and enable fast lookups
WatchHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true })

// Index for sorting by watch date
WatchHistorySchema.index({ userId: 1, watchedAt: -1 })

// Update timestamp on save
WatchHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// TTL index for automatic cleanup after 90 days
WatchHistorySchema.index({ watchedAt: 1 }, { expireAfterSeconds: 7776000 }) // 90 days

const WatchHistory = mongoose.model('WatchHistory', WatchHistorySchema)
module.exports = WatchHistory
