<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import FormInput from '@/components/inputs/FormInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import * as yup from 'yup'
import { BillingDetails, SignupPlan } from '@/types'
import {
  confirmCardPayment,
  createCardElement,
  createPaymentMethod,
  getCardElement
} from '@/controllers/stripeController'
import { createPaymentIntent } from '@/services/stripeService'

const props = defineProps<{
  formData: {
    id: string
    name: string
    email: string
    address: string
    city: string
    state: string
    zip: string
  }
  selectedPlan: SignupPlan
}>()

const emit = defineEmits(['paymentComplete'])
const priceKey = ref('')
const fullName = ref('')
const email = ref('')
const customer = ref('')

watch(
  () => props.formData,
  (data) => {
    fullName.value = data.name
    email.value = data.email
    customer.value = data.id
  },
  { deep: true, immediate: true }
)

watch(
  () => props.selectedPlan,
  (plan) => {
    priceKey.value = plan.priceKey
  },
  { deep: true, immediate: true }
)

const loading = ref(false)

const billingFormData = {
  id: '',
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  ...props.formData
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

const handleBillingSubmit = billingForm.handleSubmit(async (values: any) => {
  console.log(values)
  alert(JSON.stringify(values, null, 2))
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
    const res = await createPaymentIntent({ priceKey: priceKey.value, customer: customer.value })
    // get the secret
    const secret = res.data.data.secret
    // create the payment method
    const paymentMethodReq = await createPaymentMethod(cardElement, billingDetails)
    // confirm the payment with the secret from the intent
    const { error } = confirmCardPayment(secret, paymentMethodReq.paymentMethod.id)
    // an error occurred while creating a payment
    if (error) {
      console.error(`Payment Failed: ${error}`)
      return
    } else {
      // done..
      loading.value = false
      emit('paymentComplete', billingDetails)
    }
  } catch (err) {
    console.error(err)
  }
})

let element = null
// lifecycle hooks
onMounted(() => {
  if (!element) {
    const element = createCardElement()
    element.mount('#stripe-element-mount-point')
  }
  loading.value = false
})
</script>

<template>
  <form @submit="handleBillingSubmit" class="flex-1 flex flex-col">
    <pre>{{ billingFormData }}</pre>
    <div id="Billing" class="space-y-2">
      <h2 class="font-bold text-xl">Billing</h2>
      <!-- Add a hidden field with the lookup_key of your Price -->
      <input type="hidden" name="customer" v-model="customer" />
      <input type="hidden" name="priceKey" v-model="priceKey" />
      <input type="hidden" name="email" v-model="email" />
      <FormInput name="name" label="Name" v-model="fullName" placeholder="Your Name" />
      <FormInput
        name="address"
        label="Address"
        placeholder="Your street address"
        v-model="billingFormData.address"
      />
      <FormInput name="city" label="City" placeholder="Your City" v-model="billingFormData.city" />
      <div class="flex gap-4">
        <FormInput
          name="state"
          label="State"
          placeholder="Your State"
          v-model="billingFormData.state"
        />
        <FormInput name="zip" label="Zip" placeholder="Your Zip" v-model="billingFormData.zip" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium text-slate-300">Credit Card Information</label>
        <div id="stripe-element-mount-point" class="bg-app-blue rounded-lg text-white p-2.5"></div>
      </div>
    </div>
    <div class="form-controls mt-6">
      <BaseButton
        :disabled="!billingForm.meta.value.valid"
        id="checkout-and-portal-button"
        class="max-w-fit"
        type="submit"
        :is-primary="true"
      >
        {{ loading ? 'loading...' : `Subscribe ${selectedPlan.cost} / monthly` }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped></style>
