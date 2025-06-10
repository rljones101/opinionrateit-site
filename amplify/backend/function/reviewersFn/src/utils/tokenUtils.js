const crypto = require('crypto')
const jwt = require('jsonwebtoken')

exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

exports.createResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

exports.createPasswordResetToken = (resetToken) => {
  return crypto.createHash('sha256').update(resetToken).digest('hex')
}
