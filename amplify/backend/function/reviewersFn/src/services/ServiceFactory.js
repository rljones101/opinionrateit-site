const UserService = require('./dynamodb/UserService')

/**
 * Factory for data services. The app is DynamoDB-only; this indirection is
 * kept so controllers depend on an interface rather than a concrete service.
 */
class ServiceFactory {
  constructor() {
    this.services = new Map()
  }

  getUserService() {
    const cacheKey = 'userService'
    if (this.services.has(cacheKey)) {
      return this.services.get(cacheKey)
    }
    const service = new UserService()
    this.services.set(cacheKey, service)
    return service
  }

  clearCache() {
    this.services.clear()
  }
}

// Singleton instance
const serviceFactory = new ServiceFactory()

module.exports = serviceFactory
