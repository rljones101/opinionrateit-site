const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

/**
 * Database manager. The app uses DynamoDB exclusively (MongoDB has been
 * removed). Kept as a thin manager so callers have a single connect()/status
 * surface.
 */
class DatabaseManager {
  constructor() {
    this.useDynamoDB = process.env.USE_DYNAMODB !== 'false' // default on
    this.dynamoClient = null
  }

  async connect() {
    await this.connectDynamoDB()
  }

  async connectDynamoDB() {
    try {
      const config = {
        region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1'
      }

      // Local DynamoDB configuration
      if (process.env.NODE_ENV === 'development' && process.env.DYNAMODB_ENDPOINT) {
        config.endpoint = process.env.DYNAMODB_ENDPOINT
        config.credentials = {
          accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || 'fake',
          secretAccessKey:
            process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || 'fake'
        }
      } else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        config.credentials = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      }

      const client = new DynamoDBClient(config)
      this.dynamoClient = DynamoDBDocumentClient.from(client)

      // Test connection
      const { ListTablesCommand } = require('@aws-sdk/client-dynamodb')
      await client.send(new ListTablesCommand({}))

      console.log('✅ DynamoDB connection successful!')
      console.log('DynamoDB region:', config.region)
      console.log('DynamoDB endpoint:', config.endpoint || 'AWS Production')
    } catch (error) {
      console.error('❌ DynamoDB connection failed:', error)
      throw error
    }
  }

  getDynamoClient() {
    if (!this.dynamoClient) {
      throw new Error('DynamoDB client not initialized. Call connect() first.')
    }
    return this.dynamoClient
  }

  isUsingDynamoDB() {
    return this.useDynamoDB
  }
}

// Singleton instance
const databaseManager = new DatabaseManager()

module.exports = databaseManager
