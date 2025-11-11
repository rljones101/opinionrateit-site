const ReviewLike = require('../models/reviewLikeModel')
const ReviewReply = require('../models/reviewReplyModel')
const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Like a review
exports.likeReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  
  // Check if review exists
  const review = await Review.findById(reviewId)
  if (!review) {
    return next(new AppError('Review not found', 404))
  }
  
  // Create like (will fail if already exists due to unique index)
  try {
    const like = await ReviewLike.create({
      reviewId,
      userId: req.user.id
    })
    
    // Get updated count
    const likesCount = await ReviewLike.countDocuments({ reviewId })
    
    res.status(200).json({
      status: 'success',
      data: {
        like,
        likesCount
      }
    })
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('You have already liked this review', 400))
    }
    throw error
  }
})

// Unlike a review
exports.unlikeReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  
  const like = await ReviewLike.findOneAndDelete({
    reviewId,
    userId: req.user.id
  })
  
  if (!like) {
    return next(new AppError('Like not found', 404))
  }
  
  // Get updated count
  const likesCount = await ReviewLike.countDocuments({ reviewId })
  
  res.status(200).json({
    status: 'success',
    data: { likesCount }
  })
})

// Get review replies
exports.getReplies = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || 'newest'
  
  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }
  
  const replies = await ReviewReply.find({ reviewId })
    .populate('userId', 'name email photo')
    .sort(sortOption)
    .skip(offset)
    .limit(limit)
  
  const total = await ReviewReply.countDocuments({ reviewId })
  
  // Format replies
  const formattedReplies = replies.map(reply => ({
    id: reply._id,
    reviewId: reply.reviewId,
    userId: reply.userId._id,
    user: {
      id: reply.userId._id,
      name: reply.userId.name,
      avatar: reply.userId.photo
    },
    content: reply.content,
    parentReplyId: reply.parentReplyId,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt
  }))
  
  res.status(200).json({
    status: 'success',
    data: {
      replies: formattedReplies,
      total,
      hasMore: offset + limit < total
    }
  })
})

// Add reply
exports.addReply = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params
  const { content, parentReplyId } = req.body
  
  if (!content || content.trim().length === 0) {
    return next(new AppError('Reply content is required', 400))
  }
  
  if (content.length > 500) {
    return next(new AppError('Reply cannot exceed 500 characters', 400))
  }
  
  // Check if review exists
  const review = await Review.findById(reviewId)
  if (!review) {
    return next(new AppError('Review not found', 404))
  }
  
  const reply = await ReviewReply.create({
    reviewId,
    userId: req.user.id,
    content: content.trim(),
    parentReplyId: parentReplyId || null
  })
  
  // Populate user data
  await reply.populate('userId', 'name email photo')
  
  res.status(201).json({
    status: 'success',
    data: {
      reply: {
        id: reply._id,
        reviewId: reply.reviewId,
        userId: reply.userId._id,
        user: {
          id: reply.userId._id,
          name: reply.userId.name,
          avatar: reply.userId.photo
        },
        content: reply.content,
        parentReplyId: reply.parentReplyId,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt
      }
    }
  })
})

// Delete reply
exports.deleteReply = catchAsync(async (req, res, next) => {
  const reply = await ReviewReply.findOneAndDelete({
    _id: req.params.replyId,
    userId: req.user.id
  })
  
  if (!reply) {
    return next(new AppError('Reply not found or you do not have permission', 404))
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Reply deleted'
  })
})
