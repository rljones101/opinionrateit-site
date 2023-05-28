import * as factory from './handlerFactory.js'
import { Review } from '../models/reviewModel.js'

const getAllReviews = factory.getAll(Review)
export { getAllReviews }