const express = require('express')
const authController = require('../controllers/authController')
const authControllerDynamo = require('../controllers/authController.dynamo')
const serviceFactory = require('../services/ServiceFactory')

const router = express.Router()

// Test route to check which database is being used
router.get('/database-status', (req, res) => {
  const databaseManager = require('../config/database')
  
  res.json({
    status: 'success',
    data: {
      usingMongoDB: databaseManager.isUsingMongoDB(),
      usingDynamoDB: databaseManager.isUsingDynamoDB(),
      environment: process.env.NODE_ENV,
      mongoEnv: process.env.USE_MONGODB,
      dynamoEnv: process.env.USE_DYNAMODB
    }
  })
})

// Test route for DynamoDB user operations
router.post('/dynamo/test-user', async (req, res) => {
  try {
    const userService = serviceFactory.getUserService()
    
    const testUser = {
      name: 'API Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      passwordConfirm: 'testpassword123',
      bio: 'Created via API test'
    }
    
    const user = await userService.createUser(testUser)
    
    res.json({
      status: 'success',
      message: 'DynamoDB user created successfully',
      data: { user }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
})

// Test authentication with DynamoDB
router.post('/dynamo/signup', authControllerDynamo.signup)
router.post('/dynamo/login', authControllerDynamo.login)

// Test authentication with MongoDB (existing)
router.post('/mongo/signup', authController.signup)
router.post('/mongo/login', authController.login)

// Protected route to test authentication
router.get('/protected', authControllerDynamo.protect, (req, res) => {
  res.json({
    status: 'success',
    message: 'Access granted to protected route',
    user: req.user
  })
})

module.exports = router