import signupViewController from '@/controllers/signupViewController'
import type { BillingDetails } from '@/types'

/* @ts-ignore */
const stripe = Stripe(import.meta.env.VITE_STRIPE_KEY)
const elements = stripe.elements()

async function createPaymentMethod(
  cardElement: Element | undefined,
  billingDetails: BillingDetails
) {
  return await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails
  })
}

async function confirmCardPayment(secret: string, paymentMethodId: string) {
  return await stripe.confirmCardPayment(secret, {
    payment_method: paymentMethodId
  })
}

function createElement(elementType: string) {
  return !getCardElement()
    ? elements.create(elementType, signupViewController.style)
    : getCardElement()
}

function getElement(elementType: string): Element | undefined {
  return elements.getElement(elementType)
}

function createCardElement() {
  return createElement('card')
}

function getCardElement() {
  return getElement('card')
}

export {
  stripe,
  getElement,
  getCardElement,
  createElement,
  createCardElement,
  createPaymentMethod,
  confirmCardPayment
}
