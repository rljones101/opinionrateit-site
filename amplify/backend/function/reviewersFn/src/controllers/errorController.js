const AppError = require('../utils/appError.js')

// Catch all errors and return errors based on type that is cast

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const sendErrorProd = (err, res) => {
  // Operations, trusted err: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.log('ERROR', err)
    // 2) send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

// Must accept 4 args (err, req, res, next) — Express only recognises a
// middleware as an *error* handler by its arity. Without `next`, errors fall
// through to Express's default handler (which returns an HTML page).
module.exports = (err, req, res, next) => {
  // Return default 500 code unless provided
  err.statusCode = err.statusCode || 500
  // Return status 'error' unless provided
  err.status = err.status || 'error'

  const env = process.env.NODE_ENV

  if (env === 'production') {
    // Fix - use the err.constructor.name to get the name of the error
    let error = Object.assign(err)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

    sendErrorProd(error, res)
  } else {
    // development (and any other env): return JSON error with stack trace
    sendErrorDev(err, res)
  }
}
