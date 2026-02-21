const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

class DynamoDBClientManager {
  constructor() {
    this.client = null
    this.docClient = null
  }

  getInstance() {
    if (!this.docClient) {
      this.initialize()
    }
    return this.docClient
  }

  getRawClient() {
    if (!this.client) {
      this.initialize()
    }
    return this.client
  }

  initialize() {
    const config = {
      region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1'
    }

    // Local DynamoDB configuration for development
    if (process.env.NODE_ENV === 'development' && process.env.DYNAMODB_ENDPOINT) {
      config.endpoint = process.env.DYNAMODB_ENDPOINT
      config.credentials = {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || 'fake',
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || 'fake'
      }
      console.log('🔧 Using local DynamoDB at:', config.endpoint)
    } else {
      // Production AWS configuration
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        config.credentials = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      }
      console.log('🔧 Using AWS DynamoDB in region:', config.region)
    }

    this.client = new DynamoDBClient(config)
    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: true,
        convertClassInstanceToMap: false
      },
      unmarshallOptions: {
        wrapNumbers: false
      }
    })
  }

  getTableName(baseTableName) {
    const prefix = process.env.DYNAMODB_TABLE_PREFIX || 'prod'
    return `${baseTableName}-${prefix}`
  }
}

// Singleton instance
const dynamoDBClientManager = new DynamoDBClientManager()

module.exports = dynamoDBClientManager