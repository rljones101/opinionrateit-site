const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb')
const express = require('express')

// Simple admin interface for local DynamoDB
const app = express()
const port = 8001

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'fake', secretAccessKey: 'fake' }
})

const docClient = DynamoDBDocumentClient.from(client)

app.use(express.static('public'))

// API to get all items from a table
app.get('/api/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 50 // Limit for development
    }))
    
    res.json({
      items: result.Items,
      count: result.Count,
      scannedCount: result.ScannedCount
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Simple HTML interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>DynamoDB Local Admin</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .table { margin: 20px 0; }
        .item { background: #f5f5f5; margin: 5px 0; padding: 10px; border-radius: 4px; }
        pre { background: #eee; padding: 10px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>DynamoDB Local Admin</h1>
      <div id="tables"></div>
      
      <script>
        const tables = ['reviewers-app-dev', 'user-sessions-dev', 'user-activity-dev']
        
        async function loadTable(tableName) {
          try {
            const response = await fetch('/api/table/' + tableName)
            const data = await response.json()
            
            const div = document.createElement('div')
            div.className = 'table'
            div.innerHTML = \`
              <h2>\${tableName} (\${data.count} items)</h2>
              \${data.items.map(item => \`
                <div class="item">
                  <strong>PK:</strong> \${item.PK} | <strong>SK:</strong> \${item.SK}
                  <pre>\${JSON.stringify(item, null, 2)}</pre>
                </div>
              \`).join('')}
            \`
            
            document.getElementById('tables').appendChild(div)
          } catch (error) {
            console.error('Error loading table:', tableName, error)
          }
        }
        
        // Load all tables
        tables.forEach(loadTable)
      </script>
    </body>
    </html>
  `)
})

app.listen(port, () => {
  console.log(`🔍 DynamoDB Admin interface running at http://localhost:${port}`)
})