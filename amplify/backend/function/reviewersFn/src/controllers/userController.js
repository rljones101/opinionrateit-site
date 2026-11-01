const catchAsync = require('./../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const { uploadToS3, deleteFromS3 } = require('../utils/s3Upload.js')
const serviceFactory = require('../services/ServiceFactory')
const ActivityService = require('../services/dynamodb/ActivityService')

const activityService = new ActivityService()

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

const uid = (req) => req.user.userId || req.user.id

// GET /api/v1/users  (admin)
exports.getAll = catchAsync(async (req, res) => {
  const userService = serviceFactory.getUserService()
  const { users } = await userService.getUsers({ limit: parseInt(req.query.limit) || 100 })

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  })
})

// DELETE /api/v1/users/:id  (admin)
exports.deleteUser = catchAsync(async (req, res) => {
  const userService = serviceFactory.getUserService()
  await userService.deleteUser(req.params.id)

  res.status(204).json({ status: 'success', data: null })
})

// GET /api/v1/profile/:name
exports.getUserByName = catchAsync(async (req, res) => {
  const slug = req.params.name.trim().replace(/ /g, '-').toLowerCase()
  const userService = serviceFactory.getUserService()
  const user = await userService.getBySlug(slug)

  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

// PATCH /api/v1/users/updateMe
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)
    )
  }

  const filteredBody = filterObj(
    req.body,
    'name',
    'bio',
    'location',
    'website',
    'socialLinks'
  )

  const userService = serviceFactory.getUserService()
  const updatedUser = await userService.updateUser(uid(req), filteredBody)

  // Fire-and-forget activity log.
  activityService
    .logActivity(uid(req), 'profile_update', 'Updated profile', `Updated: ${Object.keys(filteredBody).join(', ')}`, {
      updatedFields: Object.keys(filteredBody)
    })
    .catch((err) => console.error('Failed to log profile update activity:', err.message))

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  })
})

// DELETE /api/v1/users/deleteMe
exports.deleteMe = catchAsync(async (req, res) => {
  const userService = serviceFactory.getUserService()
  await userService.deactivateUser(uid(req))

  res.status(204).json({ status: 'success', data: null })
})

// POST /api/v1/users/me/avatar
exports.uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide an image file', 400))
  }

  const userService = serviceFactory.getUserService()
  const currentUser = await userService.getUserById(uid(req))

  const avatarUrl = await uploadToS3(req.file.buffer, req.file.filename, req.file.mimetype)

  const updatedUser = await userService.updateAvatar(uid(req), avatarUrl)

  // Clean up the previous avatar if it changed.
  if (currentUser && currentUser.photo && currentUser.photo !== avatarUrl) {
    await deleteFromS3(currentUser.photo)
  }

  activityService
    .logActivity(uid(req), 'profile_update', 'Updated profile picture', 'Uploaded new avatar', {
      action: 'avatar_upload'
    })
    .catch((err) => console.error('Failed to log avatar upload activity:', err.message))

  res.status(200).json({
    status: 'success',
    data: { avatarUrl: updatedUser.photo }
  })
})
