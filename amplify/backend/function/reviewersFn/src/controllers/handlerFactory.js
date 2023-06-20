const catchAsync = require('../utils/catchAsync.js')
const AppError = require('../utils/appError.js')
const APIFeatures = require('../utils/apiFeatures.js')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(204).json({
      status: 'success',
      data: null
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    })
  })

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)

    const doc = await query

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: doc
    })
  })

exports.search = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {}

    const field = req.query.field // field
    const value = req.query.value // field value

    if (field && value) {
      filter[field] = { $regex: `${value}`, $options: 'i' }
    }

    // EXECUTE QUERY
    const doc = await Model.find(filter).collation({ locale: 'en', strength: 2 })

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // To allow for nested GET reviews on Tour
    let filter = {}
    // if (req.params.tourId) filter = { tour: req.params.tourId };
    //if (req.params.name) filter = { name: `/${req.params.name}/i` }

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const doc = await features.query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    })
    // res.json({
    //   success: 'get call succeed',
    //   results: doc.length,
    //   url: req.url,
    //   data: {
    //     data: doc
    //   }
    // })
  })
