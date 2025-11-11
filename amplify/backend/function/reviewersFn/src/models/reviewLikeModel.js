const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewLikeSchema = new Schema({
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: [true, 'Like must belong to a review'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Like must belong to a user'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Compound index to prevent duplicate likes
ReviewLikeSchema.index({ reviewId: 1, userId: 1 }, { unique: true })

const ReviewLike = mongoose.model('ReviewLike', ReviewLikeSchema)
module.exports = ReviewLike
