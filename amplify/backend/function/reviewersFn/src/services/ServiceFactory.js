const databaseManager = require('../config/database')

// MongoDB services (existing)
const User = require('../models/userModel')

// DynamoDB services (new)
const UserService = require('./dynamodb/UserService')

class ServiceFactory {
  constructor() {
    this.services = new Map()
  }

  /**
   * Get user service based on configuration
   */
  getUserService() {
    const cacheKey = 'userService'
    
    if (this.services.has(cacheKey)) {
      return this.services.get(cacheKey)
    }

    let service
    
    if (databaseManager.isUsingDynamoDB()) {
      service = new UserService()
    } else if (databaseManager.isUsingMongoDB()) {
      service = new MongoUserServiceAdapter()
    } else {
      throw new Error('No database configuration specified')
    }

    this.services.set(cacheKey, service)
    return service
  }

  /**
   * Clear service cache (useful for testing)
   */
  clearCache() {
    this.services.clear()
  }
}

/**
 * Adapter to make MongoDB User model compatible with DynamoDB service interface
 */
class MongoUserServiceAdapter {
  async createUser(userData) {
    const user = await User.create(userData)
    return this.formatUser(user)
  }

  async getUserById(userId) {
    const user = await User.findById(userId)
    return user ? this.formatUser(user) : null
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase() })
    return user ? this.formatUser(user) : null
  }

  async getUserWithPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    return user ? user.toObject() : null
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    )
    return user ? this.formatUser(user) : null
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password')
    
    if (!user) {
      throw new Error('User not found')
    }

    const isCurrentPasswordCorrect = await user.correctPassword(currentPassword, user.password)
    if (!isCurrentPasswordCorrect) {
      throw new Error('Current password is incorrect')
    }

    user.password = newPassword
    user.passwordConfirm = newPassword
    await user.save()

    return this.formatUser(user)
  }

  async activateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId, 
      { active: true }, 
      { new: true }
    )
    return user ? this.formatUser(user) : null
  }

  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId, 
      { active: false }, 
      { new: true }
    )
    return user ? this.formatUser(user) : null
  }

  async deleteUser(userId) {
    await User.findByIdAndDelete(userId)
    return true
  }

  async getUsers(options = {}) {
    const { limit = 20, skip = 0, role } = options
    
    let query = User.find({ active: { $ne: false } })
    
    if (role) {
      query = query.where('role').equals(role)
    }
    
    const users = await query
      .limit(limit)
      .skip(skip)
      .exec()

    return {
      users: users.map(user => this.formatUser(user)),
      count: users.length
    }
  }

  changedPasswordAfter(user, JWTTimestamp) {
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
      return JWTTimestamp < changedTimestamp
    }
    return false
  }

  async comparePassword(candidatePassword, userPassword) {
    const bcrypt = require('bcryptjs')
    return await bcrypt.compare(candidatePassword, userPassword)
  }

  /**
   * Format MongoDB user to match DynamoDB service response
   */
  formatUser(user) {
    const userObj = user.toObject ? user.toObject() : user
    
    return {
      userId: userObj._id.toString(),
      PK: `USER#${userObj._id.toString()}`,
      SK: 'PROFILE',
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      active: userObj.active,
      slug: userObj.slug,
      bio: userObj.bio,
      location: userObj.location,
      website: userObj.website,
      twitter: userObj.twitter,
      linkedin: userObj.linkedin,
      photo: userObj.photo,
      youTubeChannelId: userObj.youTubeChannelId,
      createdAt: userObj.createdAt?.toISOString(),
      updatedAt: userObj.updatedAt?.toISOString(),
      passwordChangedAt: userObj.passwordChangedAt?.toISOString()
    }
  }
}

// Singleton instance
const serviceFactory = new ServiceFactory()

module.exports = serviceFactory