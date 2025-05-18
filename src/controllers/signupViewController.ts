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

export default {
  style,
  defaultPlan: signupPlans[0],
  isReviewerPlan,
  getSignupPlans
}
