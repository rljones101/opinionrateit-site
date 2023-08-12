import { apiPost } from '@/utils/AppApi'

const createCheckoutSession = async (formData: any) => {
  return await apiPost('/stripe/create-checkout-session', formData)
}

const createPaymentIntent = async (formData: any) => {
  return await apiPost('/stripe/create-intent', formData)
}

const createCustomer = async (formData: any) => {
  return await apiPost('/stripe/create-customer', formData)
}

export { createCheckoutSession, createPaymentIntent, createCustomer }
