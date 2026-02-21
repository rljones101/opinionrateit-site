import { ref, onMounted } from 'vue'
import type { BillingDetails } from '@/types'
import { stripeElementsStyle } from '@/config/stripe'

// Stripe types
interface StripeElement {
  mount: (selector: string) => void
  unmount: () => void
  destroy: () => void
  on: (event: string, handler: (event: any) => void) => void
}

interface StripeElements {
  create: (type: string, options?: any) => StripeElement
  getElement: (type: string) => StripeElement | null
}

interface StripeInstance {
  elements: () => StripeElements
  createPaymentMethod: (options: any) => Promise<any>
  confirmCardPayment: (clientSecret: string, options: any) => Promise<any>
}

declare global {
  interface Window {
    Stripe: (key: string) => StripeInstance
  }
}

export function useStripe() {
  const stripe = ref<StripeInstance | null>(null)
  const elements = ref<StripeElements | null>(null)
  const cardElement = ref<StripeElement | null>(null)
  const isLoaded = ref(false)
  const error = ref<string | null>(null)

  /**
   * Initialize Stripe with publishable key
   */
  const initializeStripe = () => {
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_KEY
      
      if (!stripeKey) {
        throw new Error('Stripe publishable key not found. Set VITE_STRIPE_KEY in .env')
      }

      if (typeof window.Stripe === 'undefined') {
        throw new Error('Stripe.js not loaded. Make sure <script src="https://js.stripe.com/v3/"></script> is in index.html')
      }

      stripe.value = window.Stripe(stripeKey)
      elements.value = stripe.value.elements()
      isLoaded.value = true
      error.value = null
      
      console.log('✅ Stripe initialized successfully')
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Stripe initialization error:', err)
    }
  }

  /**
   * Create a card element with proper styling
   */
  const createCardElement = () => {
    if (!elements.value) {
      throw new Error('Stripe elements not initialized. Call initializeStripe() first.')
    }

    // Check if card element already exists
    const existingElement = elements.value.getElement('card')
    if (existingElement) {
      cardElement.value = existingElement
      return existingElement
    }

    // Create new card element with hex colors (no oklch)
    cardElement.value = elements.value.create('card', {
      style: stripeElementsStyle
    })

    return cardElement.value
  }

  /**
   * Get existing card element
   */
  const getCardElement = () => {
    if (!elements.value) return null
    return elements.value.getElement('card')
  }

  /**
   * Mount card element to DOM
   */
  const mountCardElement = (selector: string) => {
    try {
      if (!cardElement.value) {
        cardElement.value = createCardElement()
      }

      cardElement.value.mount(selector)
      console.log('✅ Stripe card element mounted to', selector)
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error mounting Stripe element:', err)
      throw err
    }
  }

  /**
   * Create payment method from card element
   */
  const createPaymentMethod = async (billingDetails: BillingDetails) => {
    if (!stripe.value) {
      throw new Error('Stripe not initialized')
    }

    const element = cardElement.value || getCardElement()
    if (!element) {
      throw new Error('Card element not found')
    }

    try {
      const result = await stripe.value.createPaymentMethod({
        type: 'card',
        card: element,
        billing_details: billingDetails
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error creating payment method:', err)
      throw err
    }
  }

  /**
   * Confirm card payment with client secret
   */
  const confirmCardPayment = async (clientSecret: string, paymentMethodId: string) => {
    if (!stripe.value) {
      throw new Error('Stripe not initialized')
    }

    try {
      const result = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (err: any) {
      error.value = err.message
      console.error('❌ Error confirming payment:', err)
      throw err
    }
  }

  /**
   * Unmount and destroy card element
   */
  const destroyCardElement = () => {
    if (cardElement.value) {
      try {
        cardElement.value.unmount()
        cardElement.value.destroy()
        cardElement.value = null
        console.log('✅ Stripe card element destroyed')
      } catch (err) {
        console.error('Error destroying card element:', err)
      }
    }
  }

  /**
   * Clear any errors
   */
  const clearError = () => {
    error.value = null
  }

  // Initialize on mount
  onMounted(() => {
    initializeStripe()
  })

  return {
    // State
    stripe,
    elements,
    cardElement,
    isLoaded,
    error,

    // Methods
    initializeStripe,
    createCardElement,
    getCardElement,
    mountCardElement,
    createPaymentMethod,
    confirmCardPayment,
    destroyCardElement,
    clearError
  }
}
