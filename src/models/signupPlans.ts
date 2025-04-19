import type { SignupPlan } from '@/types'

const userPlan = {
  name: 'User Plan',
  role: 'user',
  priceKey: 'price_1NPQZgAsO1Vic8ePmBWTc44U',
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
  steps: ['Choose Plan', 'Account', 'Billing', 'Complete']
}
const reviewerPlan = {
  name: 'Reviewer Plan',
  role: 'reviewer-basic',
  priceKey: 'price_1NPQaiAsO1Vic8ePaVUDjPE4',
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
  steps: ['Choose Plan', 'Add YouTube Account', 'Account', 'Billing', 'Complete']
}

const signupPlans: SignupPlan[] = [userPlan, reviewerPlan]

export { signupPlans }
