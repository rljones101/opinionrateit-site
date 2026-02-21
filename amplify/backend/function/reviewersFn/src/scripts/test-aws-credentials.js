require('dotenv').config({ path: './.env.development' })
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb')

async function testAWSCredentials() {
  console.log('🔐 Testing AWS Credentials...\n')
  
  // Check if credentials are set
  console.log('Environment Variables:')
  console.log('  AWS_REGION:', process.env.AWS_REGION || 'NOT SET')
  console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ SET' : '❌ NOT SET')
  console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ SET' : '❌ NOT SET')
  console.log('  DYNAMODB_ENDPOINT:', process.env.DYNAMODB_ENDPOINT || 'Using AWS (not local)')
  console.log()
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in environment variables')
    console.error('\n📝 Please update your .env.development file with:')
    console.error('   AWS_ACCESS_KEY_ID=your-access-key')
    console.error('   AWS_SECRET_ACCESS_KEY=your-secret-key')
    console.error('\n📖 See AWS_CREDENTIALS_SETUP.md for detailed instructions')
    process.exit(1)
  }
  
  // Test DynamoDB connection
  try {
    const config = {
      region: process.env.AWS_REGION || 'us-east-1'
    }
    
    // Only use endpoint if specified (for local DynamoDB)
    if (process.env.DYNAMODB_ENDPOINT) {
      config.endpoint = process.env.DYNAMODB_ENDPOINT
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    }
    
    const client = new DynamoDBClient(config)
    
    console.log('🔌 Connecting to DynamoDB...')
    console.log('   Region:', config.region)
    console.log('   Endpoint:', config.endpoint || 'AWS Production')
    console.log()
    
    const command = new ListTablesCommand({})
    const response = await client.send(command)
    
    console.log('✅ Successfully connected to DynamoDB!')
    console.log()
    console.log('📋 Existing tables:', response.TableNames.length)
    if (response.TableNames.length > 0) {
      response.TableNames.forEach(table => {
        console.log('   -', table)
      })
    } else {
      console.log('   (No tables found - this is normal for first setup)')
    }
    console.log()
    console.log('🎉 Your AWS credentials are working correctly!')
    console.log()
    console.log('Next steps:')
    console.log('  1. Create tables: npm run dynamo:setup:aws')
    console.log('  2. Test DynamoDB: npm run dynamo:test')
    console.log('  3. Start backend: npm run dev:dynamo')
    
  } catch (error) {
    console.error('❌ Failed to connect to DynamoDB')
    console.error()
    console.error('Error:', error.message)
    console.error()
    
    if (error.name === 'CredentialsProviderError') {
      console.error('💡 This looks like a credentials issue.')
      console.error('   Make sure your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are correct.')
    } else if (error.name === 'UnrecognizedClientException') {
      console.error('💡 The security token or access key is invalid.')
      console.error('   Please check your AWS credentials in .env.development')
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Cannot connect to DynamoDB endpoint.')
      console.error('   If using local DynamoDB, make sure it\'s running: npm run dynamo:start')
      console.error('   If using AWS DynamoDB, comment out DYNAMODB_ENDPOINT in .env.development')
    } else {
      console.error('💡 Unexpected error. Full details:')
      console.error(error)
    }
    
    process.exit(1)
  }
}

testAWSCredentials()