import axios from 'axios';

class ReviewerService {

  async getReviewers() {
    const response = await axios.get('reviewers.json')
    const reviewers = response.data
    return reviewers
  }
}
export default new ReviewerService()
