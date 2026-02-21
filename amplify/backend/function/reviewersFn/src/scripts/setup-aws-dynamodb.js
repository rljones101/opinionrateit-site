const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { 
  CreateTableCommand, 
  ListTablesCommand,
  DeleteTableCommand,
  DescribeTableCommand
} = require('@aws-sdk/client-dynamodb')

// Load environment variables
require('dotenv').config({ path: './.env.development' })

// AWS DynamoDB configuration (uses actual AWS, not local)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || process.env.DYNAMODB_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const tableDefinitions = [
  {
    TableName: 'reviewers-app-dev',
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' },
      { AttributeName: 'GSI2PK', AttributeType: 'S' },
      { AttributeName: 'GSI2SK', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand pricing (free tier eligible)
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      },
      {
        IndexName: 'GSI2',
        KeySchema: [
          { AttributeName: 'GSI2PK', KeyType: 'HASH' },
          { AttributeName: 'GSI2SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ],
    Tags: [
      { Key: 'Environment', Value: 'development' },
      { Key: 'Project', Value: 'reviewers-app' }
    ]
  },
  {
    TableName: 'user-sessions-dev',
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ],
    Tags: [
      { Key: 'Environment', Value: 'development' },
      { Key: 'Project', Value: 'reviewers-app' }
    ]
  },
  {
    TableName: 'user-activity-dev',
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ],
    Tags: [
      { Key: 'Environment', Value: 'development' },
      { Key: 'Project', Value: 'reviewers-app' }
    ]
  }
]

async function checkTableExists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }))
    return true
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false
    }
    throw error
  }
}

async function waitForTableActive(tableName, maxAttempts = 30) {
  console.log(`⏳ Waiting for table ${tableName} to become active...`)
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await client.send(new DescribeTableCommand({ TableName: tableName }))
      
      if (result.Table.TableStatus === 'ACTIVE') {
        console.log(`✅ Table ${tableName} is now active`)
        return true
      }
      
      console.log(`   Status: ${result.Table.TableStatus} (attempt ${i + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
    } catch (error) {
      console.error(`   Error checking table status: ${error.message}`)
    }
  }
  
  throw new Error(`Table ${tableName} did not become active within expected time`)
}

async function setupTables(options = {}) {
  const { deleteExisting = false } = options
  
  try {
    console.log('🚀 Setting up AWS DynamoDB tables...')
    console.log(`📍 Region: ${process.env.AWS_REGION || 'us-east-1'}`)
    console.log(`🏷️  Table prefix: dev`)
    
    // Verify AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env.development file')
    }
    
    // List existing tables
    const { TableNames } = await client.send(new ListTablesCommand({}))
    console.log('📋 Existing tables:', TableNames.length > 0 ? TableNames.join(', ') : 'None')
    
    // Delete existing tables if requested
    if (deleteExisting) {
      for (const tableDef of tableDefinitions) {
        if (TableNames.includes(tableDef.TableName)) {
          console.log(`🗑️  Deleting existing table: ${tableDef.TableName}`)
          await client.send(new DeleteTableCommand({ TableName: tableDef.TableName }))
          
          // Wait for deletion to complete
          console.log(`⏳ Waiting for table deletion...`)
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
    }
    
    // Create tables
    for (const tableDef of tableDefinitions) {
      const exists = await checkTableExists(tableDef.TableName)
      
      if (exists) {
        console.log(`⚠️  Table ${tableDef.TableName} already exists, skipping creation`)
        continue
      }
      
      console.log(`📋 Creating table: ${tableDef.TableName}`)
      await client.send(new CreateTableCommand(tableDef))
      
      // Wait for table to become active
      await waitForTableActive(tableDef.TableName)
    }
    
    console.log('\n🎉 All tables created successfully!')
    console.log('\n💡 Your tables are using On-Demand billing (pay-per-request)')
    console.log('💰 This is covered by AWS Free Tier for development usage')
    console.log('\n📊 You can view your tables in the AWS Console:')
    console.log(`   https://console.aws.amazon.com/dynamodbv2/home?region=${process.env.AWS_REGION || 'us-east-1'}#tables`)
    
  } catch (error) {
    console.error('❌ Error setting up tables:', error.message)
    
    if (error.message.includes('credentials')) {
      console.error('\n💡 Make sure you have set your AWS credentials in .env.development:')
      console.error('   AWS_ACCESS_KEY_ID=your-access-key')
      console.error('   AWS_SECRET_ACCESS_KEY=your-secret-key')
    }
    
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const deleteExisting = args.includes('--delete') || args.includes('-d')

// Run setup if called directly
if (require.main === module) {
  if (deleteExisting) {
    console.log('⚠️  WARNING: This will delete existing tables!')
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...')
    setTimeout(() => {
      setupTables({ deleteExisting: true })
    }, 5000)
  } else {
    setupTables()
  }
}

module.exports = { setupTables, tableDefinitions }