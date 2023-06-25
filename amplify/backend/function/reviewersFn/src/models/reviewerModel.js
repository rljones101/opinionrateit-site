const mongoose = require('mongoose')
const reviewerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a user']
  },
  name: {
    type: String,
    trim: true
  },
  channelId: {
    type: String,
    required: [true, 'A Youtube channelId is required for adding a reviewer']
  },
  avatar: {
    type: String
  },
  thumbnailMedium: {
    type: String
  },
  description: {
    type: String
  },
  social: {
    type: [],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  numPublishedVideos: {
    type: Number,
    default: 0
  },
  avgClarity: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgProductView: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgProductDetailExplanation: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgNonBias: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgAverageReviewTime: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgProductFocus: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgProvidedResources: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgShare: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  avgOverallPresentation: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  metric: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val)
  },
  views: {
    type: Number,
    default: 0
  }
})

const Reviewer = mongoose.model('Reviewer', reviewerSchema)
module.exports = Reviewer
