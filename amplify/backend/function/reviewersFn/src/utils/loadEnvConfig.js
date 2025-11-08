function loadEnvConfig(env) {
  if (env === 'development') {
    const dotenv = require('dotenv')
    const path = require('path')
    const fs = require('fs')
    
    const envPath = path.join(__dirname, '../.env.development')
    console.log('Looking for .env file at:', envPath)
    console.log('File exists:', fs.existsSync(envPath))
    
    const result = dotenv.config({ path: envPath })
    if (result.error) {
      console.log('Error loading .env:', result.error)
    } else {
      console.log('Environment loaded successfully')
      console.log('DATABASE_HOST:', process.env.DATABASE_HOST)
      console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
    }
  }
}
module.exports = loadEnvConfig
