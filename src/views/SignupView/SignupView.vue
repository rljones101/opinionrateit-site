<script setup lang="ts">
// Components
import BaseButton from '@/components/buttons/BaseButton.vue'
import NoAuthLayout from '@/components/layouts/NoAuthLayout.vue'
// Types
import { SIGNUP_STEPS } from '@/types'
// Stores
import { useSignupStore } from '@/stores/signupStore'
import BillingStep from '@/views/SignupView/BillingStep.vue'
import YoutubeStep from '@/views/SignupView/YoutubeStep.vue'
import AccountStep from '@/views/SignupView/AccountStep.vue'
import ChoosePlans from '@/views/SignupView/ChoosePlans.vue'
import PricingCards from '@/views/SignupView/PricingCards.vue'

const signupStore = useSignupStore()
signupStore.reset()
</script>

<template>
  <NoAuthLayout>
    <div class="relative flex-1 flex flex-col items-stretch h-full w-full">
      <!-- Step 1: Pricing Cards -->
      <Transition name="fade">
        <div
          key="PricingCards"
          v-show="signupStore.currentStep === SIGNUP_STEPS.CHOOSE_PLAN"
          id="PricingCards"
          class="flex flex-col container mx-auto items-center justify-center space-y-8 lg:space-y-0 lg:flex-row lg:space-x-8 mb-8"
        >
          <PricingCards />
        </div>
      </Transition>

      <div
        v-show="signupStore.currentStep !== SIGNUP_STEPS.CHOOSE_PLAN"
        class="flex w-full bg-app-blue-soft p-8 rounded-lg shadow-lg shadow-black"
      >
        <div class="min-w-max w-[254px] step-wrapper pr-8 border-r border-slate-700">
          <div class="flex justify-center">
            <BaseButton @click="signupStore.goToPreviousStep" type="primary">Go Back</BaseButton>
          </div>

          <ChoosePlans />
        </div>
        <TransitionGroup
          class="form-wrapper flex-1 w-full relative flex flex-col items-center"
          name="fade"
          tag="div"
        >
          <YoutubeStep :key="1" />
          <AccountStep :key="2" />
          <BillingStep :key="3" />
        </TransitionGroup>
      </div>
    </div>
  </NoAuthLayout>
</template>

<style scoped>
.form-wrapper {
  flex-grow: 1;
  height: 100%;
}

.form-wrapper > * {
  flex: 1;
}
</style>
