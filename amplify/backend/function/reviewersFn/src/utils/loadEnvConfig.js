function loadEnvConfig(env) {
  if (env === 'development') {
    const dotenv = require('dotenv')
    dotenv.config({ path: './config.env' })
  }
}
module.exports = loadEnvConfig
