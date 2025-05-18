<script setup lang="ts">
import { type AccountDetails, SIGNUP_STEPS } from '@/types'
import { useSignupStore } from '@/stores/signupStore'
import AccountForm from '@/components/forms/AccountForm.vue'

const signupStore = useSignupStore()

const handleSubmitAccount = async (formData: AccountDetails) => {
  try {
    await signupStore.setAccountData(formData)
    signupStore.goToNextStep()
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div key="register" v-if="signupStore.currentStep === SIGNUP_STEPS.ACCOUNT" class="w-full px-8">
    <AccountForm :form-data="signupStore.accountFormData" @submit="handleSubmitAccount" />
  </div>
</template>

<style scoped></style>
