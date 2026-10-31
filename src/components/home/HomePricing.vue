<script setup lang="ts">
import PricingCard from '@/components/cards/PricingCard.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import type { SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'
import { useSignupStore } from '@/stores/signupStore'
import { useNavRoutes } from '@/composables/useNavRoutes'

const signupStore = useSignupStore()
const { goToSignup } = useNavRoutes()
const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()

// Feature descriptions for each tier based on requirements
const getFeatureList = (plan: SignupPlan) => {
  if (plan.role === 'free') {
    return [
      { label: 'Browse reviews', checked: true },
      { label: 'Read reviews', checked: true },
      { label: 'Watch videos', checked: true },
      { label: 'Basic search', checked: true },
      { label: 'Save up to 10 favorites', checked: true },
      { label: 'Post reviews', checked: false },
      { label: 'Unlimited favorites', checked: false },
      { label: 'Follow reviewers', checked: false }
    ]
  } else if (plan.role === 'basic') {
    return [
      { label: 'Everything in Free', checked: true },
      { label: 'Post reviews', checked: true },
      { label: 'Unlimited favorites', checked: true },
      { label: 'Follow reviewers', checked: true },
      { label: 'YouTube channel connection', checked: false },
      { label: 'Video reviews', checked: false },
      { label: 'Analytics', checked: false }
    ]
  } else if (plan.role === 'creator') {
    return [
      { label: 'Everything in Basic', checked: true },
      { label: 'YouTube channel connection', checked: true },
      { label: 'Video reviews', checked: true },
      { label: 'Analytics', checked: true }
    ]
  }
  return []
}

// Pre-select the chosen tier in the signup flow, then route to signup.
const choosePlan = async (role: string) => {
  signupStore.selectPlan(role)
  await goToSignup()
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-4xl text-center text-brand-300 uppercase">Choose Your Plan</h2>
    <p class="mt-3 mb-10 text-center text-default-300">
      Start free, upgrade anytime. No credit card required.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
      <div v-for="plan in signupPlans" :key="plan.role" class="relative flex">
        <span
          v-if="plan.role === 'basic'"
          class="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-orange-500 text-white text-xs font-semibold uppercase px-3 py-1 rounded-full shadow"
        >
          Most Popular
        </span>
        <PricingCard
          :plan-name="plan.name"
          :pricing="plan.cost > 0 ? plan.cost.toString() : undefined"
          @selected="choosePlan(plan.role)"
          class="h-full"
        >
          <template #list>
            <CheckListItem
              v-for="(feature, index) in getFeatureList(plan)"
              :key="index"
              :line-through="!feature.checked"
              :is-checked="feature.checked"
            >
              {{ feature.label }}
            </CheckListItem>
          </template>
        </PricingCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
