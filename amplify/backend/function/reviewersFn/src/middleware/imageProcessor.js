const sharp = require('sharp')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Resize and optimize avatar image
exports.resizeAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  try {
    // Generate unique filename
    const filename = `avatar-${req.user.id}-${Date.now()}.webp`

    // Process image: resize to 400x400 and convert to WebP
    req.file.buffer = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 90 })
      .toBuffer()

    // Update file info
    req.file.filename = filename
    req.file.mimetype = 'image/webp'

    next()
  } catch (error) {
    return next(new AppError('Error processing image. Please try another image.', 400))
  }
})
