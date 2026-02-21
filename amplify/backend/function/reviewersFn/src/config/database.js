const mongoose = require('mongoose')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

class DatabaseManager {
  constructor() {
    this.useMongoDB = process.env.USE_MONGODB === 'true'
    this.useDynamoDB = process.env.USE_DYNAMODB === 'true'
    this.dynamoClient = null
    this.mongoConnection = null
  }

  async connect() {
    if (this.useMongoDB) {
      await this.connectMongoDB()
    }
    
    if (this.useDynamoDB) {
      await this.connectDynamoDB()
    }

    if (!this.useMongoDB && !this.useDynamoDB) {
      throw new Error('No database configuration specified. Set USE_MONGODB=true or USE_DYNAMODB=true')
    }
  }

  async connectMongoDB() {
    try {
      const DATABASE_USER = process.env.DATABASE_USER
      const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
      const DATABASE_HOST = process.env.DATABASE_HOST
      const DATABASE_PORT = process.env.DATABASE_PORT
      const DATABASE_NAME = process.env.DATABASE_NAME

      await mongoose.connect(
        `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`,
        { dbName: DATABASE_NAME }
      )

      console.log('✅ MongoDB connection successful!')
      console.log('Connected to database:', mongoose.connection.db.databaseName)
      this.mongoConnection = mongoose.connection
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      throw error
    }
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
          secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || 'fake'
        }
      } else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // AWS DynamoDB with explicit credentials
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

  getMongoConnection() {
    if (!this.mongoConnection) {
      throw new Error('MongoDB connection not initialized. Call connect() first.')
    }
    return this.mongoConnection
  }

  isUsingMongoDB() {
    return this.useMongoDB
  }

  isUsingDynamoDB() {
    return this.useDynamoDB
  }
}

// Singleton instance
const databaseManager = new DatabaseManager()

module.exports = databaseManager