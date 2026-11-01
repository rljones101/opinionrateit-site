const catchAsync = require('../utils/catchAsync')
const ActivityService = require('../services/dynamodb/ActivityService')

const activityService = new ActivityService()

const uid = (req) => req.user.userId || req.user.id

// GET /api/v1/users/me/activity
exports.getActivity = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const types = req.query.type ? req.query.type.split(',') : null

  const { activities, total, hasMore } = await activityService.getActivity(uid(req), {
    limit,
    offset,
    types
  })
  const stats = await activityService.getStats(uid(req))

  res.status(200).json({
    status: 'success',
    data: { activities, stats, total, hasMore }
  })
})
