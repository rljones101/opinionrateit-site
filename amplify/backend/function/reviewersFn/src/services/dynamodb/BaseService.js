const { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand, 
  ScanCommand,
  BatchWriteCommand,
  BatchGetCommand
} = require('@aws-sdk/lib-dynamodb')
const DynamoDBClient = require('./DynamoDBClient')
const AppError = require('../../utils/appError')

class BaseService {
  constructor(tableName) {
    this.tableName = DynamoDBClient.getTableName(tableName)
    this.client = DynamoDBClient.getInstance()
  }

  /**
   * Put an item into the table
   */
  async putItem(item, options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...options
      }

      const result = await this.client.send(new PutCommand(params))
      return params.Item
    } catch (error) {
      this.handleError('putItem', error, { item })
    }
  }

  /**
   * Get an item by primary key
   */
  async getItem(key, options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        Key: key,
        ...options
      }

      const result = await this.client.send(new GetCommand(params))
      return result.Item || null
    } catch (error) {
      this.handleError('getItem', error, { key })
    }
  }

  /**
   * Update an item
   */
  async updateItem(key, updateExpression, expressionAttributeValues, options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW',
        ...options
      }

      // Add updatedAt to the update expression if not already present
      if (!updateExpression.includes('updatedAt')) {
        params.UpdateExpression += ', updatedAt = :updatedAt'
      }

      const result = await this.client.send(new UpdateCommand(params))
      return result.Attributes
    } catch (error) {
      this.handleError('updateItem', error, { key, updateExpression })
    }
  }

  /**
   * Delete an item
   */
  async deleteItem(key, options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        Key: key,
        ...options
      }

      await this.client.send(new DeleteCommand(params))
      return true
    } catch (error) {
      this.handleError('deleteItem', error, { key })
    }
  }

  /**
   * Query items
   */
  async query(keyConditionExpression, options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ...options
      }

      const result = await this.client.send(new QueryCommand(params))
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount
      }
    } catch (error) {
      this.handleError('query', error, { keyConditionExpression })
    }
  }

  /**
   * Query with pagination support
   */
  async queryWithPagination(keyConditionExpression, options = {}) {
    const { limit = 20, lastEvaluatedKey, ...otherOptions } = options
    
    const queryOptions = {
      Limit: limit,
      ...otherOptions
    }

    if (lastEvaluatedKey) {
      queryOptions.ExclusiveStartKey = lastEvaluatedKey
    }

    return await this.query(keyConditionExpression, queryOptions)
  }

  /**
   * Scan table (use sparingly)
   */
  async scan(options = {}) {
    try {
      const params = {
        TableName: this.tableName,
        ...options
      }

      const result = await this.client.send(new ScanCommand(params))
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount
      }
    } catch (error) {
      this.handleError('scan', error)
    }
  }

  /**
   * Batch write items (up to 25 items)
   */
  async batchWrite(items, operation = 'PUT') {
    try {
      if (items.length === 0) return []
      if (items.length > 25) {
        throw new AppError('Batch write supports maximum 25 items', 400)
      }

      const requestItems = items.map(item => {
        if (operation === 'PUT') {
          return {
            PutRequest: {
              Item: {
                ...item,
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          }
        } else if (operation === 'DELETE') {
          return {
            DeleteRequest: {
              Key: item
            }
          }
        }
      })

      const params = {
        RequestItems: {
          [this.tableName]: requestItems
        }
      }

      const result = await this.client.send(new BatchWriteCommand(params))
      
      // Handle unprocessed items
      if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
        console.warn('Some items were not processed:', result.UnprocessedItems)
      }

      return items
    } catch (error) {
      this.handleError('batchWrite', error, { itemCount: items.length })
    }
  }

  /**
   * Batch get items (up to 100 items)
   */
  async batchGet(keys, options = {}) {
    try {
      if (keys.length === 0) return []
      if (keys.length > 100) {
        throw new AppError('Batch get supports maximum 100 items', 400)
      }

      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
            ...options
          }
        }
      }

      const result = await this.client.send(new BatchGetCommand(params))
      return result.Responses[this.tableName] || []
    } catch (error) {
      this.handleError('batchGet', error, { keyCount: keys.length })
    }
  }

  /**
   * Check if item exists
   */
  async exists(key) {
    const item = await this.getItem(key, { ProjectionExpression: 'PK' })
    return !!item
  }

  /**
   * Generate a unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Create timestamp
   */
  createTimestamp() {
    return new Date().toISOString()
  }

  /**
   * Handle errors consistently
   */
  handleError(operation, error, context = {}) {
    console.error(`DynamoDB ${operation} error:`, {
      error: error.message,
      table: this.tableName,
      context,
      stack: error.stack
    })

    // Map DynamoDB errors to application errors
    if (error.name === 'ConditionalCheckFailedException') {
      throw new AppError('Item already exists or condition not met', 409)
    } else if (error.name === 'ResourceNotFoundException') {
      throw new AppError('Table not found', 404)
    } else if (error.name === 'ValidationException') {
      throw new AppError(`Invalid request: ${error.message}`, 400)
    } else if (error.name === 'ProvisionedThroughputExceededException') {
      throw new AppError('Request rate too high, please try again later', 429)
    } else if (error.name === 'ItemCollectionSizeLimitExceededException') {
      throw new AppError('Item collection size limit exceeded', 400)
    } else {
      throw new AppError(`Database operation failed: ${error.message}`, 500)
    }
  }

  /**
   * Log operation for debugging
   */
  logOperation(operation, params, result) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`DynamoDB ${operation}:`, {
        table: this.tableName,
        params: JSON.stringify(params, null, 2),
        result: result ? 'Success' : 'No result'
      })
    }
  }
}

module.exports = BaseService