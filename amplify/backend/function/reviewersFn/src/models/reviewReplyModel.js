const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewReplySchema = new Schema({
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: [true, 'Reply must belong to a review'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reply must belong to a user'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Reply must have content'],
    maxlength: [500, 'Reply cannot be more than 500 characters']
  },
  parentReplyId: {
    type: Schema.Types.ObjectId,
    ref: 'ReviewReply',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Index for fetching replies by review
ReviewReplySchema.index({ reviewId: 1, createdAt: -1 })

// Index for nested replies
ReviewReplySchema.index({ parentReplyId: 1 })

// Update timestamp on save
ReviewReplySchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const ReviewReply = mongoose.model('ReviewReply', ReviewReplySchema)
module.exports = ReviewReply
