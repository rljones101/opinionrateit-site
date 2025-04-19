function loadEnvConfig() {
  if (process.env.NODE_ENV === 'development') {
    const dotenv = require('dotenv')
    dotenv.config({ path: './config.env' })
  }
}
module.exports = loadEnvConfig
