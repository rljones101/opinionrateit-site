const mongoose = require('mongoose')
const Reviewer = require('./reviewerModel.js')

const reviewSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: [true, 'A Youtube Channel Id is required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a user']
    },
    videoId: {
      type: String,
      required: [true, 'A review requires a video id']
    },
    comment: String,
    clarity: Number,
    product_view: Number,
    product_detail_explanation: Number,
    non_bias: Number,
    average_review_time: Number,
    product_focus: Number,
    provided_resources: Number,
    overall_presentation: Number,
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    statics: {
      async calcReviewAvgs(channelId) {
        const stats = await this.aggregate([
          {
            // Match all documents by channelId
            $match: { channelId }
          },
          {
            // Group by the channelId and get the avg for each value
            $group: {
              _id: '$channelId',
              avg_clarity: { $avg: '$clarity' },
              avg_product_view: { $avg: '$product_view' },
              avg_product_detail_explanation: { $avg: '$product_detail_explanation' },
              avg_non_bias: { $avg: '$non_bias' },
              avg_average_review_time: { $avg: '$average_review_time' },
              avg_product_focus: { $avg: '$product_focus' },
              avg_provided_resources: { $avg: '$provided_resources' },
              avg_overall_presentation: { $avg: '$overall_presentation' }
            }
          },
          {
            // Get the metric overall average
            $addFields: {
              metric: {
                $avg: [
                  '$avg_clarity',
                  '$avg_product_view',
                  '$avg_product_detail_explanation',
                  '$avg_non_bias',
                  '$avg_average_review_time',
                  '$avg_product_focus',
                  '$avg_provided_resources',
                  '$avg_overall_presentation'
                ]
              }
            }
          }
        ])

        // Take these aggregated values and apply them to another model
        if (stats.length > 0) {
          await Reviewer.findOneAndUpdate(
            { channelId },
            {
              avgClarity: stats[0].avg_clarity,
              avgProductView: stats[0].avg_product_view,
              avgProductDetailExplanation: stats[0].avg_product_detail_explanation,
              avgNonBias: stats[0].avg_non_bias,
              avgAverageReviewTime: stats[0].avg_average_review_time,
              avgProductFocus: stats[0].avg_product_focus,
              avgProvidedResources: stats[0].avg_provided_resources,
              avgOverallPresentation: stats[0].avg_overall_presentation,
              metric: stats[0].metric
            }
          )
        }
      }
    }
  }
)

reviewSchema.index({ channelId: 1 })
reviewSchema.index({ user: 1 })
reviewSchema.index({ videoId: 1 })

reviewSchema.post('save', function () {
  // calculate averages
  this.constructor.calcReviewAvgs(this.channelId)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne()
  // console.log(this.r);
  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcReviewAvgs(this.r.channelId)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
