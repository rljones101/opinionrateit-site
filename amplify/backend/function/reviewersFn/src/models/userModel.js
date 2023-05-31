const mongoose = require('mongoose')
const validate = require('validator')
const bcrypt = require('bcryptjs')
const tokenUtils = require('../utils/tokenUtils.js')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be provided'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'An email must be provided'],
    unique: true,
    lowercase: true,
    maxlength: [40, 'An email must have less or equal then 40 characters'],
    minlength: [10, 'An email must have more or equal than 10 characters'],
    validate: {
      validator: validate.isEmail,
      message: 'Email {{VALUE}} is invalid'
    }
  },
  // photo - need to lookup how I would save the images
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'reviewer', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A password must be provided'],
    minlength: [8, 'A password must be more or equal then 8 characters'],
    // hide this field!
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A password must be provided'],
    minlength: [8, 'A password must be more or equal then 8 characters'],
    validate: {
      validator: function (val) {
        // This only works on SAVE!
        // This only points to the current doc on NEW document creation
        return val === this.password
      }
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // We only inactivate users and don't remove them
  active: {
    type: Boolean,
    default: true,
    select: false
  }
})

// QUERY MIDDLEWARE ==================================

// Find ONLY active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

// Update and hash password
userSchema.pre('save', async function (next) {
  // If password has NOT been modified then skip
  if (!this.isModified('password')) return next()
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  // Set the passwordConfirm to undefined
  this.passwordConfirm = undefined
  // done, proceed
  next()
})

// Update passwordChangeAt field
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

// SCHEMA METHODS ==================================

// Method used to compare password against passwordConfirm
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

// Method used to see if the password was changed after the JWT timestamp value
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Method used to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = tokenUtils.createResetToken()
  this.passwordResetToken = tokenUtils.createPasswordResetToken(resetToken)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  // console.log({ resetToken }, this.passwordResetToken)
  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
