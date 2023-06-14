// published videos { publishedId, userId: 123, videoId: 123, active: true }
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PublishedVideoSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'A user Id is required']
    },
    channelId: {
      type: String,
      required: [true, 'A published video requires a channel Id']
    },
    title: {
      type: String,
      required: [true, 'A video title is required'],
      minlength: [8, 'A title must be at least 8 characters long']
    },
    videoId: {
      type: String,
      unique: true,
      required: [true, 'A video Id is required']
    },
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

PublishedVideoSchema.index({ userId: 1 })
PublishedVideoSchema.index({ videoId: 1 })
PublishedVideoSchema.index({ title: 1 })
PublishedVideoSchema.index({ channelId: 1 })

// QUERY MIDDLEWARE ===========================================================
PublishedVideoSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'user',
      select: 'name email'
    }
  ])
  next()
})

const PublishedVideo = mongoose.model('PublishedVideo', PublishedVideoSchema)
module.exports = PublishedVideo
