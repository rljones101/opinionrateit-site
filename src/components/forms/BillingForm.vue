<script setup lang="ts">
import FormInput from '@/components/inputs/FormInput.vue'
import SubmitButton from '@/components/buttons/SubmitButton.vue'
import { useBillingForm } from '@/composables/useBillingForm'

const {
  customer,
  productKey,
  email,
  fullName,
  planCost,
  billingFormData,
  isFormValid,
  loading,
  handleSubmit
} = useBillingForm()
</script>

<template>
  <form @submit="handleSubmit" class="flex-1 flex flex-col">
    <div id="Billing" class="space-y-2">
      <h2 class="font-bold text-xl">Billing</h2>
      <!-- Add a hidden field with the lookup_key of your Price -->
      <input type="hidden" name="customer" v-model="customer" />
      <input type="hidden" name="priceKey" v-model="productKey" />
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
      <SubmitButton :disabled="!isFormValid" id="checkout-and-portal-button" class="max-w-fit">
        {{ loading ? 'loading...' : `Subscribe ${planCost} / monthly` }}
      </SubmitButton>
    </div>
  </form>
</template>

<style scoped></style>
