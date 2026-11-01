import { signupPlans } from '@/models/signupPlans'
import type { SignupPlan } from '@/types'
import colors from 'tailwindcss/colors'

const style = {
  style: {
    base: {
      iconColor: '#000',
      color: colors.slate['400'],
      fontWeight: 'normal',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu",
      fontSize: '14px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#f77216'
      },
      '::placeholder': {
        color: colors.slate['400']
      }
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: 'red'
    }
  }
}

function isReviewerPlan(role: string): boolean {
  return ['reviewer-basic', 'reviewer-plus'].includes(role)
}

function getSignupPlans(): SignupPlan[] {
  return signupPlans
}

export interface PlanFeature {
  label: string
  checked: boolean
}

// Shared tier presentation so the home page and signup flow stay in sync.
// Anyone can browse/read/watch without an account, so each tier's list leads
// with what it actually unlocks beyond the public/previous tier (the
// "Everything in ... plus" framing lives in the features heading).
function getFeatureList(role: string): PlanFeature[] {
  switch (role) {
    case 'free':
      return [
        { label: 'Rate & review videos', checked: true },
        { label: 'Save up to 10 favorites', checked: true },
        { label: 'Like & reply to reviews', checked: true },
        { label: 'Track your watch history', checked: true },
        { label: 'Your own profile', checked: true },
        { label: 'Post unlimited reviews', checked: false },
        { label: 'Unlimited favorites', checked: false },
        { label: 'Follow reviewers', checked: false }
      ]
    case 'basic':
      return [
        { label: 'Post unlimited reviews', checked: true },
        { label: 'Unlimited favorites', checked: true },
        { label: 'Follow reviewers', checked: true },
        { label: 'Community engagement', checked: true },
        { label: 'YouTube channel connection', checked: false },
        { label: 'Video reviews', checked: false },
        { label: 'Analytics dashboard', checked: false }
      ]
    case 'creator':
      return [
        { label: 'YouTube channel connection', checked: true },
        { label: 'Publish video reviews', checked: true },
        { label: 'Analytics dashboard', checked: true },
        { label: 'Performance metrics', checked: true }
      ]
    default:
      return []
  }
}

function getPlanTagline(role: string): string {
  switch (role) {
    case 'free':
      return 'Create a free account to go from watching to taking part.'
    case 'basic':
      return 'Everything in Free, with no limits — review and connect freely.'
    case 'creator':
      return 'For reviewers who want reach, insight, and their own channel.'
    default:
      return ''
  }
}

function getFeaturesHeading(role: string): string {
  switch (role) {
    case 'free':
      return 'What your account unlocks'
    case 'basic':
      return 'Everything in Free, plus'
    case 'creator':
      return 'Everything in Basic, plus'
    default:
      return 'Features'
  }
}

export default {
  style,
  defaultPlan: signupPlans[0],
  isReviewerPlan,
  getSignupPlans,
  getFeatureList,
  getPlanTagline,
  getFeaturesHeading
}
