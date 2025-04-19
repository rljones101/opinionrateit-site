// bookmarked videos { userId: 123, publishedVideoId: 123, bookmarked: true }
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookmarkedVideoSchema = new Schema({
  userId: String,
  publishedVideoId: String,
  bookmarked: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const BookmarkedVideo = mongoose.model('BookmarkedVideo', BookmarkedVideoSchema)
module.exports = BookmarkedVideo
