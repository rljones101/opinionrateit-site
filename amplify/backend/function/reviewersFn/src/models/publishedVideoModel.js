// published videos { publishedId, userId: 123, videoId: 123, active: true }
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Reviewer = require('./reviewerModel.js')

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
    thumbnail: {
      type: String,
      required: [true, 'A video requires a thumbnail']
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
    toObject: { virtuals: true },
    collation: { locale: 'en', strength: 2 },
    statics: {
      async setVideoCount(channelId) {
        const videos = await this.aggregate([
          {
            // Match all documents by channelId
            $match: { channelId }
          },
          {
            $count: 'num_of_published_videos'
          }
        ])

        if (videos.length > 0) {
          await Reviewer.findOneAndUpdate(
            { channelId },
            { numPublishedVideos: videos[0].num_of_published_videos }
          )
        }
      }
    }
  }
)

PublishedVideoSchema.index({ userId: 1 })
PublishedVideoSchema.index({ videoId: 1 })
PublishedVideoSchema.index({ title: 'text' })
PublishedVideoSchema.index({ channelId: 1 })

// POST MIDDLEWARE ===========================================================
PublishedVideoSchema.post('save', function () {
  this.constructor.setVideoCount(this.channelId)
})

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
