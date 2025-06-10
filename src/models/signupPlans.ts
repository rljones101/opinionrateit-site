import { type SignupPlan, SIGNUP_STEPS } from '@/types'

const userPlan: SignupPlan = {
  name: 'User Plan',
  role: 'user',
  lookupKey: 'user_plan_price',
  productKey: 'prod_OBoCixB4b4I3Jw',
  cost: 0.99,
  yearlyDiscount: 0,
  allowedReviewerAccess: true,
  giveReviewerFeedback: true,
  bookmarkReviewer: true,
  addYourReviews: false,
  metricAnalysis: false,
  patreonSupport: false,
  vinmeo: false,
  twitter: false,
  steps: [
    SIGNUP_STEPS.CHOOSE_PLAN,
    SIGNUP_STEPS.ACCOUNT,
    SIGNUP_STEPS.BILLING,
    SIGNUP_STEPS.COMPLETE
  ]
}
const reviewerPlan: SignupPlan = {
  name: 'Reviewer Plan',
  role: 'reviewer-basic',
  lookupKey: 'reviewer_plan_price',
  productKey: 'prod_OAgstc19SD1o3Z',
  cost: 2.99,
  yearlyDiscount: 0.15,
  allowedReviewerAccess: true,
  giveReviewerFeedback: true,
  bookmarkReviewer: true,
  addYourReviews: true,
  metricAnalysis: true,
  patreonSupport: false,
  vinmeo: false,
  twitter: false,
  steps: [
    SIGNUP_STEPS.CHOOSE_PLAN,
    SIGNUP_STEPS.ADD_YOUTUBE_ACCOUNT,
    SIGNUP_STEPS.ACCOUNT,
    SIGNUP_STEPS.BILLING,
    SIGNUP_STEPS.COMPLETE
  ]
}

const signupPlans: SignupPlan[] = [userPlan, reviewerPlan]

export { signupPlans }
