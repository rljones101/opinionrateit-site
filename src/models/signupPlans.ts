import { type SignupPlan, SIGNUP_STEPS } from '@/types'

const freePlan: SignupPlan = {
  name: 'Free',
  role: 'free',
  lookupKey: null,
  cost: 0,
  yearlyDiscount: 0,
  requiresBilling: false,
  requiresYouTube: false,
  allowedReviewerAccess: true,
  giveReviewerFeedback: false,
  bookmarkReviewer: true,
  addYourReviews: false,
  metricAnalysis: false,
  patreonSupport: false,
  vinmeo: false,
  twitter: false,
  steps: [SIGNUP_STEPS.CHOOSE_PLAN, SIGNUP_STEPS.ACCOUNT, SIGNUP_STEPS.COMPLETE]
}

const basicPlan: SignupPlan = {
  name: 'Basic',
  role: 'basic',
  lookupKey: 'basic-tier',
  cost: 4.99,
  yearlyDiscount: 0,
  requiresBilling: true,
  requiresYouTube: false,
  allowedReviewerAccess: true,
  giveReviewerFeedback: true,
  bookmarkReviewer: true,
  addYourReviews: true,
  metricAnalysis: false,
  patreonSupport: false,
  vinmeo: false,
  twitter: false,
  steps: [SIGNUP_STEPS.CHOOSE_PLAN, SIGNUP_STEPS.ACCOUNT, SIGNUP_STEPS.BILLING, SIGNUP_STEPS.COMPLETE]
}

const creatorPlan: SignupPlan = {
  name: 'Creator',
  role: 'creator',
  lookupKey: 'creator-tier',
  cost: 14.99,
  yearlyDiscount: 0,
  requiresBilling: true,
  requiresYouTube: true,
  allowedReviewerAccess: true,
  giveReviewerFeedback: true,
  bookmarkReviewer: true,
  addYourReviews: true,
  metricAnalysis: true,
  patreonSupport: true,
  vinmeo: true,
  twitter: true,
  steps: [SIGNUP_STEPS.CHOOSE_PLAN, SIGNUP_STEPS.ADD_YOUTUBE_ACCOUNT, SIGNUP_STEPS.ACCOUNT, SIGNUP_STEPS.BILLING, SIGNUP_STEPS.COMPLETE]
}

const signupPlans: SignupPlan[] = [freePlan, basicPlan, creatorPlan]

export { signupPlans, freePlan, basicPlan, creatorPlan }
