const express = require('express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const helmet = require('helmet')
// const cookieParser = require('cookie-parser')
const cors = require('cors')
const AppError = require('./utils/appError.js')

const globalErrorHandler = require('./controllers/errorController.js')
const stripeController = require('./controllers/stripeController.js')

const loadEnvConfig = require('./utils/loadEnvConfig.js')

// Routers
const reviewerRouter = require('./routes/reviewerRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const profileRouter = require('./routes/profileRoutes.js')
const publishedVideoRouter = require('./routes/publishedVideoRoutes.js')
const reviewsRouter = require('./routes/reviewRoutes.js')
const youTubeRouter = require('./routes/youTubeRoutes.js')
const stripeRouter = require('./routes/stripeRoutes.js')

loadEnvConfig(process.env.NODE_ENV)

async function DatabaseConnect() {
  const DATABASE_USER = process.env.DATABASE_USER
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
  const DATABASE_HOST = process.env.DATABASE_HOST
  const DATABASE_PORT = process.env.DATABASE_PORT
  const DATABASE_NAME = process.env.DATABASE_NAME

  //const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  await mongoose.connect(
    `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`,
    { dbName: DATABASE_NAME }
  )
}

DatabaseConnect()
  .then(() => {
    console.log('Database connection!')
  })
  .catch((error) => console.log(error))

// declare a new express app
const app = express()

if (process.env.NODE_ENV !== 'development') {
  app.use(awsServerlessExpressMiddleware.eventContext())
}

// Set security HTTP Headers
app.use(helmet())

// Stripe Webhook - This MUST be created before the Body parser middleware!
app.post(
  '/api/v1/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeController.stripeWebHook
)

// Body parser, reading data from the body into req.body
app.use(express.json())

// Data sanitization against NoSQL query inject

// Data sanitization against XSS

// Enable CORS for all methods
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })

// Implement CORS
//app.use(cors())
const corsOptions = {
  origin: 'http://localhost:5173'
}
app.use(cors(corsOptions))
app.options('/', cors(corsOptions))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // if(process.env.NODE_ENV === 'development') {
  //   console.log('REQ COOKIES ======')
  //   console.log(req.cookies)
  //   console.log('REQ HEADERS ======')
  //   console.log(req.url)
  //   console.log('REQ HEADERS ======')
  //   console.log(req.headers)
  // }
  next()
})

app.use('/api/v1/reviewers', reviewerRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/publishedVideos', publishedVideoRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/youtube', youTubeRouter)
app.use('/api/v1/stripe', stripeRouter)

app.all('/', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.listen(3000, function () {
  console.log('App started')
})

app.use(globalErrorHandler)

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
