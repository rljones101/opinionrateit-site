<script setup lang="ts">
import { SIGNUP_STEPS } from '@/types'
import { useSignupStore } from '@/stores/signupStore'
import BillingForm from '@/components/forms/BillingForm.vue'
import { type BillingDetails } from '@/types'
import { useRouter } from 'vue-router'

const signupStore = useSignupStore()
const router = useRouter()

const onPaymentComplete = async (billingDetails: BillingDetails) => {
  await signupStore.paymentComplete(billingDetails)
  // login and go to 'videos/home' view
  await router.push({ name: 'videos' })
}
</script>

<template>
  <div
    key="UserFormAndBillCards"
    class="w-full flex flex-col gap-8"
    v-show="signupStore.currentStep === SIGNUP_STEPS.BILLING"
  >
    <!-- billing -->
    <div class="flex pl-8 gap-8">
      <BillingForm
        :form-data="signupStore.billingFormData"
        :selected-plan="signupStore.selectedPlan"
        @payment-complete="onPaymentComplete"
      />
      <div class="flex flex-col justify-between p-8 bg-app-blue rounded-lg">
        <div>
          <h2 class="text-xl mb-8">Order Summary</h2>
          <div class="flex items-start gap-8">
            <div class="flex flex-col">
              <span class="text-app-orange">Reviewer Plan</span><span>Monthly</span>
            </div>
            <div>${{ signupStore.selectedPlan.cost }}</div>
          </div>
        </div>
        <!--            <div class="flex justify-between mt-8 border-t border-app-blue pt-4">-->
        <!--              <span>TOTAL</span><span class="text-white">$4.99</span>-->
        <!--            </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
