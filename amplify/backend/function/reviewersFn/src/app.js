const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const mongoose = require('mongoose')
const reviewerRouter = require('./routes/reviewRoutes.js')

console.log('process.env', process.env)

const connectToDatabase = async () => {

  if (process.env.NODE_ENV === 'development') {
    const dotenv = await import('dotenv')
    dotenv.config({ path: './config.env' });
  }

  try {
    const DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
    );

    await mongoose.connect(DB, {useNewUrlParser: true})
    console.log('DB connection successful');
  } catch (err) {
    throw new Error('Database connection failed')
  }
}

connectToDatabase().then(() => {
  console.log('Database connected!')
})

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


app.use('/api/v1/reviewers', reviewerRouter)

/**********************
 * Example get method *
 **********************/

// app.get('/api/v1/reviewers', async () =>   catchAsync(async (req, res) => {
//   // To allow for nested GET reviews on Tour
//   let filter = {};
//   // if (req.params.tourId) filter = { tour: req.params.tourId };
//   const Model = Reviewer
//
//   // EXECUTE QUERY
//   const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//   const doc = await features.query;
//
//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: doc.length,
//     data: {
//       data: doc,
//     },
//   });
// })),


// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
