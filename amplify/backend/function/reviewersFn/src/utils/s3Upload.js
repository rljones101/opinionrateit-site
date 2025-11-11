const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const AppError = require('./appError')

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const BUCKET_NAME = process.env.S3_AVATAR_BUCKET || 'opinionrateit-avatars'
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

// Log S3 configuration on startup (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('S3 Configuration:', {
    bucket: BUCKET_NAME,
    region: process.env.AWS_REGION || 'us-east-1',
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    cloudfront: CLOUDFRONT_URL
  })
}

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} filename - Filename to use in S3
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} - Public URL of uploaded file
 */
exports.uploadToS3 = async (fileBuffer, filename, mimetype) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `avatars/${filename}`,
      Body: fileBuffer,
      ContentType: mimetype,
      // ACL removed - bucket uses bucket policy for public access instead
      CacheControl: 'max-age=31536000' // Cache for 1 year
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)

    // Return CloudFront URL if configured, otherwise S3 URL
    return `${CLOUDFRONT_URL}/avatars/${filename}`
  } catch (error) {
    console.error('S3 Upload Error Details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      bucket: BUCKET_NAME,
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    })
    console.error('Full error:', error)
    throw new AppError(`Failed to upload image to storage: ${error.message}`, 500)
  }
}

/**
 * Delete file from S3
 * @param {string} fileUrl - Full URL of file to delete
 * @returns {Promise<void>}
 */
exports.deleteFromS3 = async (fileUrl) => {
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    
    if (!filename || filename === 'default-avatar.png') {
      // Don't delete default avatar or invalid filenames
      return
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: `avatars/${filename}`
    }

    const command = new DeleteObjectCommand(params)
    await s3Client.send(command)
  } catch (error) {
    // Log error but don't throw - deletion failure shouldn't block upload
    console.error('S3 Delete Error:', error)
  }
}

/**
 * Extract filename from avatar URL
 * @param {string} avatarUrl - Avatar URL
 * @returns {string|null} - Filename or null
 */
exports.getFilenameFromUrl = (avatarUrl) => {
  if (!avatarUrl) return null
  const urlParts = avatarUrl.split('/')
  return urlParts[urlParts.length - 1]
}
