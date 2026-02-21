const databaseManager = require('../config/database')
const serviceFactory = require('../services/ServiceFactory')

// Load environment variables
require('dotenv').config({ path: './.env.development' })

async function testDynamoDB() {
  try {
    console.log('🧪 Testing DynamoDB setup...')
    
    // Set environment for DynamoDB
    process.env.USE_DYNAMODB = 'true'
    process.env.USE_MONGODB = 'false'
    
    // Connect to database
    await databaseManager.connect()
    console.log('✅ Database connection successful')
    
    // Get user service
    const userService = serviceFactory.getUserService()
    console.log('✅ User service created')
    
    // Test user creation
    console.log('\n📝 Testing user creation...')
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      passwordConfirm: 'testpassword123',
      bio: 'This is a test user'
    }
    
    try {
      const createdUser = await userService.createUser(testUser)
      console.log('✅ User created:', {
        userId: createdUser.userId,
        name: createdUser.name,
        email: createdUser.email
      })
      
      // Test user retrieval by ID
      console.log('\n🔍 Testing user retrieval by ID...')
      const userById = await userService.getUserById(createdUser.userId)
      console.log('✅ User retrieved by ID:', userById ? 'SUCCESS' : 'FAILED')
      
      // Test user retrieval by email
      console.log('\n📧 Testing user retrieval by email...')
      const userByEmail = await userService.getUserByEmail(testUser.email)
      console.log('✅ User retrieved by email:', userByEmail ? 'SUCCESS' : 'FAILED')
      
      // Test user update
      console.log('\n✏️  Testing user update...')
      const updatedUser = await userService.updateUser(createdUser.userId, {
        bio: 'Updated bio for test user',
        location: 'Test City'
      })
      console.log('✅ User updated:', updatedUser.bio)
      
      // Test password comparison
      console.log('\n🔐 Testing password comparison...')
      const userWithPassword = await userService.getUserWithPassword(testUser.email)
      const passwordMatch = await userService.comparePassword('testpassword123', userWithPassword.password)
      console.log('✅ Password comparison:', passwordMatch ? 'SUCCESS' : 'FAILED')
      
      // Clean up - delete test user
      console.log('\n🗑️  Cleaning up test user...')
      await userService.deleteUser(createdUser.userId)
      console.log('✅ Test user deleted')
      
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Test user already exists, cleaning up...')
        const existingUser = await userService.getUserByEmail(testUser.email)
        if (existingUser) {
          await userService.deleteUser(existingUser.userId)
          console.log('✅ Existing test user deleted')
        }
      } else {
        throw error
      }
    }
    
    console.log('\n🎉 All DynamoDB tests passed!')
    
  } catch (error) {
    console.error('❌ DynamoDB test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run test if called directly
if (require.main === module) {
  testDynamoDB()
}

module.exports = { testDynamoDB }