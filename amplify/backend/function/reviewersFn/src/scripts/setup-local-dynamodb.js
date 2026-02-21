const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { 
  CreateTableCommand, 
  ListTablesCommand,
  DeleteTableCommand 
} = require('@aws-sdk/client-dynamodb')

// Local DynamoDB configuration
const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'fake',
    secretAccessKey: 'fake'
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
    BillingMode: 'PAY_PER_REQUEST',
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
    ]
  }
]

async function setupTables() {
  try {
    console.log('🚀 Setting up local DynamoDB tables...')
    
    // List existing tables
    const { TableNames } = await client.send(new ListTablesCommand({}))
    console.log('Existing tables:', TableNames)
    
    // Delete existing tables if they exist
    for (const tableDef of tableDefinitions) {
      if (TableNames.includes(tableDef.TableName)) {
        console.log(`🗑️  Deleting existing table: ${tableDef.TableName}`)
        await client.send(new DeleteTableCommand({ TableName: tableDef.TableName }))
        
        // Wait a bit for deletion to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // Create tables
    for (const tableDef of tableDefinitions) {
      console.log(`📋 Creating table: ${tableDef.TableName}`)
      await client.send(new CreateTableCommand(tableDef))
      console.log(`✅ Table created: ${tableDef.TableName}`)
    }
    
    console.log('🎉 All tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error setting up tables:', error)
    process.exit(1)
  }
}

// Run setup if called directly
if (require.main === module) {
  setupTables()
}

module.exports = { setupTables, tableDefinitions }