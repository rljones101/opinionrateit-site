import { useSignupStore } from '@/stores/signupStore'
import { computed, onMounted, ref, watch } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import type { BillingDetails } from '@/types'
import {
  confirmCardPayment,
  createCardElement,
  createPaymentMethod,
  getCardElement
} from '@/controllers/stripeController'
import { createPaymentIntent } from '@/services/stripeService'

export function useBillingForm(
  emit: (event: 'paymentComplete', billingDetails: BillingDetails) => void
) {
  const signupStore = useSignupStore()
  // const emit = defineEmits(['paymentComplete'])
  const productKey = ref('')
  const fullName = ref('')
  const email = ref('')
  const customer = ref('')

  const loading = ref(false)

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
    const formData = {
      lookupKey: signupStore.selectedPlan.lookupKey,
      productKey: productKey.value,
      customer: customer.value
    }
    const res = await createPaymentIntent(formData)
    // get the secret
    return res.data.data.secret
  }

  const handleSubmit = billingForm.handleSubmit(async () => {
    if (loading.value) return
    loading.value = true
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
      // Get the card element that contains the card data
      const cardElement = getCardElement()
      // create a payment intent
      const secret = await setupPaymentIntent()
      // create the payment method
      const paymentMethodReq = await createPaymentMethod(cardElement, billingDetails)
      // confirm the payment with the secret from the intent
      const { error } = await confirmCardPayment(secret, paymentMethodReq.paymentMethod.id)
      // an error occurred while creating a payment
      if (error) {
        console.error(`Payment Failed: ${error}`)
        loading.value = false
        return
      } else {
        // done..
        loading.value = false
        emit('paymentComplete', billingDetails)
      }
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  })

  const element: any = null
  // lifecycle hooks
  onMounted(() => {
    if (!element) {
      const element = createCardElement()
      element.mount('#stripe-element-mount-point')
    }
    loading.value = false
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

  watch(
    () => signupStore.selectedPlan,
    (plan) => {
      productKey.value = plan.productKey
    },
    { deep: true, immediate: true }
  )

  return {
    customer,
    productKey,
    email,
    fullName,
    planCost,
    billingFormData,
    isFormValid,
    loading,
    handleSubmit
  }
}
