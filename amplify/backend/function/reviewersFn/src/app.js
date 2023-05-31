const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const AppError = require('./utils/appError')

const reviewerRouter = require('./routes/reviewRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const connectToDatabase = async () => {
  if (process.env.NODE_ENV === 'development') {
    const dotenv = await import('dotenv')
    dotenv.config({ path: './config.env' })
  }

  try {
    const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
    await mongoose.connect(DB, { useNewUrlParser: true })
  } catch (err) {
    throw new Error('Database connection failed')
  }
}

connectToDatabase().then(() => {
  console.log('Database connected!')
})

// declare a new express app
const app = express()

// Set security HTTP Headers
app.use(helmet())

// Body parser, reading data from the body into req.body
app.use(bodyParser.json())

// Data sanitization against NoSQL query inject
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

if (process.env.NODE_ENV !== 'development') {
  app.use(awsServerlessExpressMiddleware.eventContext())
}

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log('REQ HEADERS ======')
  console.log(req.url)
  console.log('REQ HEADERS ======')
  console.log(req.headers)
  next()
})

app.use('/api/v1/reviewers', reviewerRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
