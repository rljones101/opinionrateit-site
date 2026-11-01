const BaseService = require('./BaseService')
const { keys } = require('./entities')

/**
 * DynamoDB service for user preferences (one item per user).
 *
 * Replaces the Mongoose UserPreferences model. PK = USER#<userId>, SK = PREFERENCES.
 */
class PreferencesService extends BaseService {
  constructor() {
    super('reviewers-app')
  }

  static defaults(userId) {
    return {
      userId,
      notifications: {
        email: true,
        push: false,
        reviews: true,
        videoUpdates: true,
        weeklyDigest: false
      },
      display: { theme: 'auto', language: 'en', timezone: 'UTC', dateFormat: 'MM/DD/YYYY' },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showActivity: true,
        allowMessages: true
      },
      content: {
        autoplayVideos: true,
        showMatureContent: false,
        defaultVideoQuality: 'auto',
        subtitlesEnabled: false
      },
      security: {
        loginNotifications: true,
        suspiciousActivityAlerts: true,
        passwordExpiry: false,
        sessionTimeout: 30
      }
    }
  }

  format(item) {
    if (!item) return null
    const { PK, SK, ...rest } = item
    return rest
  }

  /**
   * Return the user's preferences, creating defaults on first access.
   */
  async getOrCreate(userId) {
    const existing = await this.getItem({
      PK: keys.preferencesPK(userId),
      SK: keys.preferencesSK()
    })
    if (existing) return this.format(existing)

    const item = {
      PK: keys.preferencesPK(userId),
      SK: keys.preferencesSK(),
      ...PreferencesService.defaults(userId)
    }
    const saved = await this.putItem(item)
    return this.format(saved)
  }

  /**
   * Partial update: each provided section (notifications/display/privacy/
   * content/security) is shallow-merged into the existing section, matching
   * the old controller's semantics.
   */
  async update(userId, updates) {
    const current = await this.getOrCreate(userId)

    const merged = { ...current }
    for (const section of ['notifications', 'display', 'privacy', 'content', 'security']) {
      if (updates[section]) {
        merged[section] = { ...current[section], ...updates[section] }
      }
    }

    const item = {
      PK: keys.preferencesPK(userId),
      SK: keys.preferencesSK(),
      ...merged
    }
    const saved = await this.putItem(item)
    return this.format(saved)
  }
}

module.exports = PreferencesService
