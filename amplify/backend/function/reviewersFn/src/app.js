const express = require('express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
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
const bookmarkRouter = require('./routes/bookmarkRoutes.js')
const watchHistoryRouter = require('./routes/watchHistoryRoutes.js')
const reviewInteractionRouter = require('./routes/reviewInteractionRoutes.js')

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
    console.log('Database connection successful!')
    console.log('Connected to database:', mongoose.connection.db.databaseName)
    console.log('Connection string used:', `mongodb://${process.env.DATABASE_USER}:***@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`)
  })
  .catch((error) => console.log(error))

// declare a new express app
const app = express()

if (process.env.NODE_ENV !== 'development') {
  app.use(awsServerlessExpressMiddleware.eventContext())
}

// Set security HTTP Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.NODE_ENV === 'development' ? "http://localhost:5173" : "https://dev.opinionrateit.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}))

// Rate limiting - relaxed for development
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Higher limit for development
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

// Specific rate limiting for auth endpoints
const authLimiter = rateLimit({
  max: 5, // limit each IP to 5 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})

// Make authLimiter available to routes
app.locals.authLimiter = authLimiter

// Stripe Webhook - This MUST be created before the Body parser middleware!
app.post(
  '/api/v1/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeController.stripeWebHook
)

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
// Temporarily disabled due to compatibility issues
// app.use(mongoSanitize())

// Data sanitization against XSS
// Temporarily disabled due to compatibility issues
// app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit']
}))

// Enable CORS for all methods
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })

// Implement CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:5173', // Vite default
      'http://localhost:5174', // Vite alternative port
      'http://localhost:3000',  // Alternative port
      'http://localhost:8080',  // Vue CLI default
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080'
    ]
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // This is crucial for cookie-based authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // Enable preflight for all routes

// Additional CORS headers for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma')
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  })
}

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
app.use('/api/v1/bookmarks', bookmarkRouter)
app.use('/api/v1/watch-history', watchHistoryRouter)
app.use('/api/v1/review-interactions', reviewInteractionRouter)

app.all('*', (req, res, next) => {
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
