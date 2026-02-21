<script setup lang="ts">
import FormInput from '@/components/inputs/FormInput.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import { useBillingForm } from '@/composables/useBillingForm'

const emit = defineEmits(['paymentComplete'])

const {
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
} = useBillingForm(emit)
</script>

<template>
  <form @submit="handleSubmit" class="flex-1 flex flex-col">
    <!-- Error message display -->
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Payment Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ errorMessage }}</p>
          <button 
            v-if="retryCount < maxRetries"
            @click.prevent="handleRetry" 
            type="button"
            class="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
    
    <div id="Billing" class="space-y-2">
      <h2 class="font-bold text-xl">Billing</h2>
      <!-- Add a hidden field with the customer ID -->
      <input type="hidden" name="customer" v-model="customer" />
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
        <label class="block mb-2 text-sm font-medium text-gray-700">Credit Card Information</label>
        <div 
          id="stripe-element-mount-point" 
          class="border border-gray-300 rounded-lg p-3 bg-white"
          style="min-height: 40px;"
        ></div>
        <p v-if="stripeError" class="mt-1 text-sm text-red-600">
          {{ stripeError }}
        </p>
        <p v-else class="mt-1 text-xs text-gray-500">
          Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
        </p>
      </div>
    </div>
    <div class="form-controls mt-6">
      <SubmitButton :disabled="!isFormValid || loading" id="checkout-and-portal-button" class="max-w-fit">
        {{ loading ? 'Processing...' : `Subscribe ${planCost} / monthly` }}
      </SubmitButton>
    </div>
  </form>
</template>

<style scoped></style>
