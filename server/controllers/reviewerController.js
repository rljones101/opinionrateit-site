import * as factory from './handlerFactory.js'
import { Reviewer  } from '../models/reviewerModel.js'

const getAllReviewers = factory.getAll(Reviewer)
export { getAllReviewers }