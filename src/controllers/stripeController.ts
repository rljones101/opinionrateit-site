import signupViewController from '@/controllers/signupViewController'
import type { BillingDetails } from '@/types'
import { stripeElementsStyle } from '@/config/stripe'

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
  // Hide the card element's built-in postal field — ZIP is collected by the
  // billing form and sent as billing_details.postal_code.
  const options: Record<string, any> = { style: stripeElementsStyle }
  if (elementType === 'card') options.hidePostalCode = true
  return !getCardElement()
    ? elements.create(elementType, options)
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
