const multer = require('multer')
const AppError = require('../utils/appError')

// Configure multer to use memory storage for processing
const multerStorage = multer.memoryStorage()

// Filter to only allow image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    // Accept only JPEG, PNG, and WebP
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new AppError('Only JPEG, PNG, and WebP images are allowed', 400), false)
    }
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false)
  }
}

// Configure multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Export middleware for single file upload
exports.uploadAvatar = upload.single('avatar')

// Error handler for multer errors
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File size cannot exceed 5MB', 400))
    }
    return next(new AppError(`Upload error: ${err.message}`, 400))
  }
  next(err)
}
