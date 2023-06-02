const AppError = require('../utils/appError')

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

module.exports = (err, req, res) => {
  // Return default 500 code unless provided
  err.statusCode = err.statusCode || 500
  // Return status 'error' unless provided
  err.status = err.status || 'error'

  const env = process.env.NODE_ENV

  // If we are dev mode, return error with stack trace
  if (env === 'development') {
    sendErrorDev(err, res)
  } else if (env === 'production') {
    // Fix - use the err.constructor.name to get the name of the error
    let error = Object.assign(err)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

    sendErrorProd(error, res)
  }
}
