const factory = require('./handlerFactory.js')
const PublishedVideo = require('../models/publishedVideoModel.js')
const catchAsync = require('../utils/catchAsync.js')

exports.getAll = factory.getAll(PublishedVideo)
exports.getOne = factory.getOne(PublishedVideo)
exports.createOne = factory.createOne(PublishedVideo)
exports.updateOne = factory.updateOne(PublishedVideo)
exports.deleteOne = factory.deleteOne(PublishedVideo)

exports.createMultiple = catchAsync(async (req, res) => {
  const doc = await PublishedVideo.create([...req.body.videos])

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})

exports.getVideosByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const videos = [...(await PublishedVideo.find({ user: userId }))]

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: {
      data: videos
    }
  })
})
