const factory = require('./handlerFactory.js')
const User = require('../models/userModel.js')
const catchAsync = require('../utils/catchAsync')

exports.getAll = factory.getAll(User)
exports.getOne = factory.getOne(User)
exports.deleteUser = factory.deleteOne(User)

exports.getUserByName = catchAsync(async (req, res) => {
  const slug = req.params.name.trim().replace(' ', '-').toLowerCase()
  const user = await User.findOne({ slug })

  res.status(200).json({
    status: 'success',
    data: {
      data: user
    }
  })
})
