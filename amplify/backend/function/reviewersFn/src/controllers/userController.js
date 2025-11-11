const factory = require('./handlerFactory.js')
const User = require('../models/userModel.js')
const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const { uploadToS3, deleteFromS3 } = require('../utils/s3Upload.js')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAll = factory.getAll(User)
exports.getOne = factory.getOne(User)
exports.deleteUser = factory.deleteOne(User)

exports.getUserByName = catchAsync(async (req, res) => {
  const slug = req.params.name.trim().replace(' ', '-').toLowerCase()
  const user = await User.findOne({ slug })

  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'bio', 'location', 'website', 'twitter', 'linkedin')

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  // Log profile update activity
  const UserActivity = require('../models/userActivityModel')
  const updatedFields = Object.keys(filteredBody)
  UserActivity.logActivity(
    req.user.id,
    'profile_update',
    'Updated profile',
    `Updated: ${updatedFields.join(', ')}`,
    { updatedFields }
  ).catch(err => console.error('Failed to log profile update activity:', err))

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide an image file', 400))
  }

  // Get current user to check for existing avatar
  const currentUser = await User.findById(req.user.id)

  // Upload new avatar to S3
  const avatarUrl = await uploadToS3(
    req.file.buffer,
    req.file.filename,
    req.file.mimetype
  )

  // Update user with new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { photo: avatarUrl },
    { new: true, runValidators: true }
  )

  // Delete old avatar from S3 (if exists and not default)
  if (currentUser.photo && currentUser.photo !== avatarUrl) {
    await deleteFromS3(currentUser.photo)
  }

  // Log avatar upload activity
  const UserActivity = require('../models/userActivityModel')
  UserActivity.logActivity(
    req.user.id,
    'profile_update',
    'Updated profile picture',
    'Uploaded new avatar',
    { action: 'avatar_upload' }
  ).catch(err => console.error('Failed to log avatar upload activity:', err))

  res.status(200).json({
    status: 'success',
    data: {
      avatarUrl: updatedUser.photo
    }
  })
})
