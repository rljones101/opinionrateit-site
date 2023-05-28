const mongoose = require('mongoose')
const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A reviewer must have a name'],
    trim: true,
    minlength: [5, 'A name must have more or equal then 5 characters'],
  },
  channelId: {
    type: String,
    required: [true, 'A Youtube channelId is required for adding a reviewer'],
  },
  social: {
    type: [],
    default: [],
  },
  metrics: {
    type: [],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
})

const Reviewer = mongoose.model('Reviewer', reviewerSchema)
module.exports = Reviewer