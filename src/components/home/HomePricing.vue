<script setup lang="ts">
import PricingCard from '@/components/cards/PricingCard.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import type { SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'
import { useNavRoutes } from '@/composables/useNavRoutes'

const { goToSignup } = useNavRoutes()
const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()

// Tier presentation is shared via the controller so the home page and signup
// flow stay in sync.
const getFeatureList = (plan: SignupPlan) => signupViewController.getFeatureList(plan.role)

// Route to signup with the chosen tier in the URL (?plan=<role>). SignupView
// reads it after resetting, so the selection survives the navigation.
const choosePlan = async (role: string) => {
  await goToSignup(role)
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
          :tagline="signupViewController.getPlanTagline(plan.role)"
          :features-heading="signupViewController.getFeaturesHeading(plan.role)"
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
