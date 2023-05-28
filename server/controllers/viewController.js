import { Reviewer } from '../models/reviewerModel.js'
import AppError from '../utils/appError.js'

export const getReviewers = async () => {
  try {
    return Reviewer.find()
  } catch (err) {
    throw new AppError('Could not find reviewers', 404)
  }
}