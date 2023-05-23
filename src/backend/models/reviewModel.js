const { Schema, model } = require('mongoose')

const reviewSchema = new Schema({
  review: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a user']
  }
})

const Review = model('Review', reviewSchema)

module.exports = Review