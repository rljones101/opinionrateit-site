import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a user']
  }
})

const Review = mongoose.model('Review', reviewSchema)

export { Review }