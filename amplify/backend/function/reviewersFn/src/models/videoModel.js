// published videos { publishedId, userId: 123, videoId: 123, active: true }
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A title is required']
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

VideoSchema.index({ title: 1 })

const Video = mongoose.model('Video', VideoSchema)
module.exports = Video
