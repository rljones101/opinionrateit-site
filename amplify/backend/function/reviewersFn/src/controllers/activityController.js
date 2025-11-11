const UserActivity = require('../models/userActivityModel')
const catchAsync = require('../utils/catchAsync')

// Get user activity with pagination and filtering
exports.getActivity = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const typeFilter = req.query.type ? req.query.type.split(',') : null
  
  // Build query
  const query = { userId: req.user.id }
  
  if (typeFilter && typeFilter.length > 0) {
    query.type = { $in: typeFilter }
  }
  
  // Get activities with pagination
  const activities = await UserActivity.find(query)
    .sort({ timestamp: -1 })
    .skip(offset)
    .limit(limit)
    .lean()
  
  // Get total count
  const total = await UserActivity.countDocuments(query)
  
  // Get activity stats
  const stats = await UserActivity.getStats(req.user.id)
  
  res.status(200).json({
    status: 'success',
    data: {
      activities,
      stats,
      total,
      hasMore: offset + limit < total
    }
  })
})
