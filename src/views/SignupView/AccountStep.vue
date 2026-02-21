<script setup lang="ts">
import { type AccountDetails, SIGNUP_STEPS } from '@/types'
import { useSignupStore } from '@/stores/signupStore'
import AccountForm from '@/components/forms/AccountForm.vue'
import { ref } from 'vue'

const signupStore = useSignupStore()
const errorMessage = ref('')
const errorField = ref('')

const handleSubmitAccount = async (formData: AccountDetails) => {
  // Clear previous errors
  errorMessage.value = ''
  errorField.value = ''
  
  try {
    await signupStore.setAccountData(formData)
    signupStore.goToNextStep()
  } catch (err: any) {
    console.error('Account step error:', err)
    
    // Extract error message from different error formats
    if (err?.response?.data?.message) {
      // Backend API error format
      errorMessage.value = err.response.data.message
      errorField.value = err.response.data.field || ''
    } else if (err?.message) {
      // Standard Error object
      errorMessage.value = err.message
    } else if (typeof err === 'string') {
      // String error
      errorMessage.value = err
    } else {
      // Generic error
      errorMessage.value = 'An error occurred while creating your account. Please try again.'
    }
    
    // Provide tier-specific guidance
    const tier = signupStore.selectedPlan.name
    if (errorMessage.value.includes('Stripe') || errorMessage.value.includes('billing')) {
      errorMessage.value += ` (${tier} tier requires billing information)`
    }
  }
}

const handleRetry = () => {
  errorMessage.value = ''
  errorField.value = ''
}
</script>

<template>
  <div key="register" v-if="signupStore.currentStep === SIGNUP_STEPS.ACCOUNT" class="w-full px-8">
    <!-- Error message display -->
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ errorMessage }}</p>
          <button 
            @click="handleRetry" 
            class="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
    
    <AccountForm 
      :form-data="signupStore.accountFormData" 
      :error-field="errorField"
      @submit="handleSubmitAccount" 
    />
  </div>
</template>

<style scoped></style>
