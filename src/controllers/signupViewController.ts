import { signupPlans } from '@/models/signupPlans'

const style = {
  style: {
    base: {
      iconColor: '#000',
      color: '#fff',
      fontWeight: '800',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu",
      fontSize: '14px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#f77216'
      },
      '::placeholder': {
        color: '#ccc'
      }
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: 'red'
    }
  }
}

function isReviewerPlan(role: string) {
  return ['reviewer-basic', 'reviewer-plus'].includes(role)
}

function getSignupPlans() {
  return signupPlans
}

export default {
  style,
  defaultPlan: signupPlans[0],
  isReviewerPlan,
  getSignupPlans
}
