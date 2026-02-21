const BaseService = require('./BaseService')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')
const validator = require('validator')
const AppError = require('../../utils/appError')

class UserService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    const { name, email, password, passwordConfirm, role, stripeCustomerId, youTubeChannelId, ...otherData } = userData

    // Validation
    this.validateUserData({ name, email, password, passwordConfirm })

    // Validate role
    const userRole = role || 'free'
    this.validateRole(userRole)

    // Check if user already exists
    const existingUser = await this.getUserByEmail(email)
    if (existingUser) {
      throw new AppError('User with this email already exists', 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate user ID and slug
    const userId = this.generateId()
    const slug = slugify(name, { lower: true })

    // Create user item
    const userItem = {
      PK: `USER#${userId}`,
      SK: 'PROFILE',
      GSI1PK: `EMAIL#${email.toLowerCase()}`,
      GSI1SK: `USER#${userId}`,
      userId,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      slug,
      role: userRole,
      active: false, // Users need to activate their account
      stripeCustomerId: stripeCustomerId || null,
      youTubeChannelId: youTubeChannelId || null,
      ...otherData
    }

    // Save user
    const savedUser = await this.putItem(userItem)

    // Remove password from response
    const { password: _, ...userResponse } = savedUser
    return userResponse
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await this.getItem({
      PK: `USER#${userId}`,
      SK: 'PROFILE'
    })

    if (!user) {
      return null
    }

    // Remove password from response
    const { password, ...userResponse } = user
    return userResponse
  }

  /**
   * Get user by email using GSI
   */
  async getUserByEmail(email) {
    const result = await this.query(
      'GSI1PK = :email',
      {
        IndexName: 'GSI1',
        ExpressionAttributeValues: {
          ':email': `EMAIL#${email.toLowerCase()}`
        },
        Limit: 1
      }
    )

    if (result.items.length === 0) {
      return null
    }

    const user = result.items[0]
    // Remove password from response
    const { password, ...userResponse } = user
    return userResponse
  }

  /**
   * Get user with password (for authentication)
   */
  async getUserWithPassword(email) {
    const result = await this.query(
      'GSI1PK = :email',
      {
        IndexName: 'GSI1',
        ExpressionAttributeValues: {
          ':email': `EMAIL#${email.toLowerCase()}`
        },
        Limit: 1
      }
    )

    return result.items.length > 0 ? result.items[0] : null
  }

  /**
   * Update user profile
   */
  async updateUser(userId, updateData) {
    const { password, passwordConfirm, email, ...allowedUpdates } = updateData

    // Don't allow email updates through this method
    if (email) {
      throw new AppError('Email cannot be updated through this endpoint', 400)
    }

    // Validate update data
    this.validateUpdateData(allowedUpdates)

    // Build update expression
    const updateExpressions = []
    const expressionAttributeValues = {}
    const expressionAttributeNames = {}

    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] !== undefined) {
        updateExpressions.push(`#${key} = :${key}`)
        expressionAttributeValues[`:${key}`] = allowedUpdates[key]
        expressionAttributeNames[`#${key}`] = key
      }
    })

    if (updateExpressions.length === 0) {
      throw new AppError('No valid fields to update', 400)
    }

    const updateExpression = `SET ${updateExpressions.join(', ')}`

    const updatedUser = await this.updateItem(
      { PK: `USER#${userId}`, SK: 'PROFILE' },
      updateExpression,
      expressionAttributeValues,
      { ExpressionAttributeNames: expressionAttributeNames }
    )

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser
    return userResponse
  }

  /**
   * Update user password
   */
  async updatePassword(userId, currentPassword, newPassword) {
    // Get user with password
    const user = await this.getItem({
      PK: `USER#${userId}`,
      SK: 'PROFILE'
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Verify current password
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordCorrect) {
      throw new AppError('Current password is incorrect', 401)
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters long', 400)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password and passwordChangedAt
    const updatedUser = await this.updateItem(
      { PK: `USER#${userId}`, SK: 'PROFILE' },
      'SET password = :password, passwordChangedAt = :passwordChangedAt',
      {
        ':password': hashedPassword,
        ':passwordChangedAt': new Date().toISOString()
      }
    )

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser
    return userResponse
  }

  /**
   * Activate user account
   */
  async activateUser(userId) {
    return await this.updateItem(
      { PK: `USER#${userId}`, SK: 'PROFILE' },
      'SET active = :active',
      { ':active': true }
    )
  }

  /**
   * Deactivate user account (soft delete)
   */
  async deactivateUser(userId) {
    return await this.updateItem(
      { PK: `USER#${userId}`, SK: 'PROFILE' },
      'SET active = :active',
      { ':active': false }
    )
  }

  /**
   * Delete user permanently
   */
  async deleteUser(userId) {
    // In a real implementation, you'd want to delete all related data
    // For now, just delete the user profile
    return await this.deleteItem({
      PK: `USER#${userId}`,
      SK: 'PROFILE'
    })
  }

  /**
   * Check if password was changed after JWT timestamp
   */
  changedPasswordAfter(user, JWTTimestamp) {
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(new Date(user.passwordChangedAt).getTime() / 1000)
      return JWTTimestamp < changedTimestamp
    }
    return false
  }

  /**
   * Compare password for authentication
   */
  async comparePassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
  }

  /**
   * Get users with pagination (admin function)
   */
  async getUsers(options = {}) {
    const { limit = 20, lastEvaluatedKey, role } = options

    let queryOptions = {
      Limit: limit,
      FilterExpression: 'SK = :sk AND active = :active'
    }

    if (lastEvaluatedKey) {
      queryOptions.ExclusiveStartKey = lastEvaluatedKey
    }

    let expressionAttributeValues = {
      ':sk': 'PROFILE',
      ':active': true
    }

    if (role) {
      queryOptions.FilterExpression += ' AND #role = :role'
      queryOptions.ExpressionAttributeNames = { '#role': 'role' }
      expressionAttributeValues[':role'] = role
    }

    queryOptions.ExpressionAttributeValues = expressionAttributeValues

    const result = await this.scan(queryOptions)

    // Remove passwords from all users
    const users = result.items.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return {
      users,
      lastEvaluatedKey: result.lastEvaluatedKey,
      count: result.count
    }
  }

  /**
   * Validate user data
   */
  validateUserData({ name, email, password, passwordConfirm }) {
    if (!name || name.trim().length === 0) {
      throw new AppError('Name is required', 400)
    }

    if (!email || !validator.isEmail(email)) {
      throw new AppError('Valid email is required', 400)
    }

    if (!password || password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400)
    }

    if (password !== passwordConfirm) {
      throw new AppError('Passwords do not match', 400)
    }
  }

  /**
   * Validate role
   */
  validateRole(role) {
    const validRoles = ['free', 'basic', 'creator', 'user', 'reviewer-basic']
    
    if (!validRoles.includes(role)) {
      throw new AppError(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400)
    }
  }

  /**
   * Validate update data
   */
  validateUpdateData(data) {
    const allowedFields = [
      'name', 'bio', 'location', 'website', 'twitter', 'linkedin', 
      'photo', 'youTubeChannelId', 'role', 'stripeCustomerId'
    ]

    // Check for invalid fields
    const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field))
    if (invalidFields.length > 0) {
      throw new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400)
    }

    // Validate specific fields
    if (data.name && data.name.trim().length === 0) {
      throw new AppError('Name cannot be empty', 400)
    }

    if (data.bio && data.bio.length > 500) {
      throw new AppError('Bio must be less than 500 characters', 400)
    }

    if (data.location && data.location.length > 100) {
      throw new AppError('Location must be less than 100 characters', 400)
    }

    if (data.website && !validator.isURL(data.website)) {
      throw new AppError('Website must be a valid URL', 400)
    }

    if (data.linkedin && !data.linkedin.includes('linkedin.com')) {
      throw new AppError('LinkedIn must be a valid LinkedIn URL', 400)
    }

    if (data.twitter && data.twitter.length > 50) {
      throw new AppError('Twitter handle must be less than 50 characters', 400)
    }

    if (data.role) {
      this.validateRole(data.role)
    }
  }
}

module.exports = UserService