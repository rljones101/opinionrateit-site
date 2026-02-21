import { useSignupStore } from '@/stores/signupStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import type { BillingDetails } from '@/types'
import { useStripe } from '@/composables/useStripe'
import { createPaymentIntent } from '@/services/stripeService'

// Updated to work with new three-tier pricing structure
export function useBillingForm(
  emit: (event: 'paymentComplete', billingDetails: BillingDetails) => void
) {
  const signupStore = useSignupStore()
  const { mountCardElement, createPaymentMethod, confirmCardPayment, destroyCardElement, error: stripeError } = useStripe()
  
  const fullName = ref('')
  const email = ref('')
  const customer = ref('')
  const loading = ref(false)
  const cardElementMounted = ref(false)
  const errorMessage = ref('')
  const retryCount = ref(0)
  const maxRetries = 3

  const planCost = computed(() => {
    return signupStore.selectedPlan.cost
  })

  const isFormValid = computed(() => {
    return billingForm.meta.value.valid
  })

  const defaultValues = {
    id: '',
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  }

  const billingFormData = {
    ...defaultValues,
    ...signupStore.billingFormData
  }

  const billingFormSchema = yup.object({
    name: yup.string().required().label('Name'),
    address: yup.string().required().label('Address'),
    city: yup.string().required().label('City'),
    state: yup.string().required().label('State'),
    zip: yup.string().required().label('Zip')
  })

  const billingForm = useForm({
    validationSchema: billingFormSchema,
    initialValues: billingFormData
  })

  const setupPaymentIntent = async () => {
    const selectedPlan = signupStore.selectedPlan
    
    // Tier-specific validation: Free tier should never access billing
    if (!selectedPlan.requiresBilling) {
      throw new Error(
        `Billing is not required for ${selectedPlan.name} tier. This step should not be accessible.`
      )
    }
    
    // Validate customer ID exists (required for all paid tiers)
    if (!customer.value) {
      throw new Error(
        `Customer ID is missing for ${selectedPlan.name} tier. Please complete the account step first.`
      )
    }
    
    // Validate lookupKey is not null (required for all paid tiers)
    if (!selectedPlan.lookupKey) {
      throw new Error(
        `Invalid plan configuration for ${selectedPlan.name} tier. Lookup key is missing.`
      )
    }
    
    const formData = {
      lookupKey: selectedPlan.lookupKey,
      customer: customer.value
    }
    
    console.log('Creating payment intent with data:', formData)
    
    const res = await createPaymentIntent(formData)
    
    if (!res || !res.data || !res.data.secret) {
      throw new Error('Invalid response from payment intent creation')
    }
    
    // get the secret
    return res.data.secret
  }

  const handleSubmit = billingForm.handleSubmit(async () => {
    if (loading.value) return
    loading.value = true
    errorMessage.value = ''
    
    try {
      // Get the billing details
      const billingDetails: BillingDetails = {
        name: fullName.value,
        email: email.value,
        address: {
          city: billingFormData.city,
          line1: billingFormData.address,
          state: billingFormData.state,
          postal_code: billingFormData.zip
        }
      }
      
      // Create a payment intent
      const secret = await setupPaymentIntent()
      
      // Create the payment method
      const paymentMethodReq = await createPaymentMethod(billingDetails)
      
      // Confirm the payment with the secret from the intent
      const { error } = await confirmCardPayment(secret, paymentMethodReq.paymentMethod.id)
      
      // An error occurred while creating a payment
      if (error) {
        console.error(`Payment Failed: ${error}`)
        errorMessage.value = `Payment failed: ${error.message || 'Please check your card details and try again.'}`
        loading.value = false
        return
      } else {
        // Payment successful - reset retry count
        retryCount.value = 0
        errorMessage.value = ''
        loading.value = false
        emit('paymentComplete', billingDetails)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      loading.value = false
      
      // Handle different error types
      if (err?.response?.data?.message) {
        // Backend API error
        errorMessage.value = err.response.data.message
      } else if (err?.message) {
        // Standard Error object
        errorMessage.value = err.message
      } else if (typeof err === 'string') {
        // String error
        errorMessage.value = err
      } else {
        // Generic error
        errorMessage.value = 'An error occurred while processing your payment. Please try again.'
      }
      
      // Check if this is a network error and suggest retry
      if (err?.code === 'ECONNABORTED' || err?.code === 'ERR_NETWORK' || err?.message?.includes('network')) {
        retryCount.value++
        if (retryCount.value < maxRetries) {
          errorMessage.value += ` (Attempt ${retryCount.value}/${maxRetries})`
        } else {
          errorMessage.value += ' Please check your internet connection and try again.'
        }
      }
    }
  })
  
  const handleRetry = () => {
    errorMessage.value = ''
    // Don't reset retry count - keep tracking for network issues
  }

  // Lifecycle hooks
  onMounted(() => {
    if (!cardElementMounted.value) {
      try {
        mountCardElement('#stripe-element-mount-point')
        cardElementMounted.value = true
      } catch (error) {
        console.error('❌ Error mounting Stripe element:', error)
      }
    }
    loading.value = false
  })

  onUnmounted(() => {
    // Clean up Stripe element when component unmounts
    destroyCardElement()
  })

  watch(
    () => signupStore.billingFormData,
    (data) => {
      fullName.value = data.name
      customer.value = data.id
      email.value = data.email
    },
    { deep: true, immediate: true }
  )

  return {
    customer,
    email,
    fullName,
    planCost,
    billingFormData,
    isFormValid,
    loading,
    stripeError,
    errorMessage,
    retryCount,
    maxRetries,
    handleSubmit,
    handleRetry
  }
}
