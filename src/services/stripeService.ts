import { apiPost } from '@/utils/AppApi'

const createCheckoutSession = async (formData: any) => {
  return await apiPost('/stripe/create-checkout-session', formData)
}

// Updated to remove productKey - only lookupKey is needed
const createPaymentIntent = async (formData: {
  lookupKey: string | null
  customer: string
}) => {
  return await apiPost('/stripe/create-intent', formData)
}

const createCustomer = async (formData: any) => {
  return await apiPost('/stripe/create-customer', formData)
}

export { createCheckoutSession, createPaymentIntent, createCustomer }
