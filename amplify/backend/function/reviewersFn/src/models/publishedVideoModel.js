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
