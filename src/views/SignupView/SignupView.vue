<script setup lang="ts">
// Components
import BaseButton from '@/components/buttons/BaseButton.vue'
// Types
import { SIGNUP_STEPS } from '@/types'
// Stores
import { useSignupStore } from '@/stores/signupStore'
import BillingStep from '@/views/SignupView/BillingStep.vue'
import YoutubeStep from '@/views/SignupView/YoutubeStep.vue'
import AccountStep from '@/views/SignupView/AccountStep.vue'
import ChoosePlans from '@/views/SignupView/ChoosePlans.vue'
import PricingCards from '@/views/SignupView/PricingCards.vue'
import MainContentWrapper from '@/components/containers/MainContentWrapper.vue'

const signupStore = useSignupStore()
signupStore.reset()
</script>

<template>
  <MainContentWrapper>
    <!-- Step 1: Pricing Cards -->
    <Transition name="fade" tag="div" class="flex flex-col md:flex-row">
      <div
        key="PricingCards"
        v-show="signupStore.currentStep === SIGNUP_STEPS.CHOOSE_PLAN"
        id="PricingCards"
        class="p-4 flex items-center justify-center gap-4"
      >
        <PricingCards />
      </div>
    </Transition>

    <div
      v-show="signupStore.currentStep !== SIGNUP_STEPS.CHOOSE_PLAN"
      class="flex w-full bg-secondary-50 p-8 rounded-lg shadow"
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
  </MainContentWrapper>
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
