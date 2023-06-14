const mongoose = require('mongoose')
const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A reviewer must have a name'],
    trim: true,
    minlength: [5, 'A name must have more or equal then 5 characters']
  },
  channelId: {
    type: String,
    required: [true, 'A Youtube channelId is required for adding a reviewer']
  },
  social: {
    type: [],
    default: []
  },
  metrics: {
    type: [],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
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
  }
})

const Reviewer = mongoose.model('Reviewer', reviewerSchema)
module.exports = Reviewer
