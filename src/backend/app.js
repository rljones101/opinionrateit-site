const path = require('path')
const express = require('express')
const helmet = require("helmet")
const logger = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const cors = require('cors')

// Imported routes
const reviewRouter = require('./routes/reviewRoutes')

// Initiate the application
const app = express()
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP Headers
app.use(helmet())
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
}
// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb'}))
// Data sanitization against NoSQL query inject
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// Add CORS
app.use(cors())

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.headers)
  next()
})

// ROUTES
app.use('/api/v1/reviews', reviewRouter)

// NO ROUTE FOUND
app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`))
})

module.exports = app