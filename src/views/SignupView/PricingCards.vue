<script setup lang="ts">
import PricingCard from '@/components/cards/PricingCard.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import { useSignupStore } from '@/stores/signupStore'
import type { SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'

const signupStore = useSignupStore()
const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()

const getFeatureList = (plan: SignupPlan) => signupViewController.getFeatureList(plan.role)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
    <PricingCard
      v-for="plan in signupPlans"
      :key="plan.role"
      :plan-name="plan.name"
      :pricing="plan.cost > 0 ? plan.cost.toString() : undefined"
      :tagline="signupViewController.getPlanTagline(plan.role)"
      :features-heading="signupViewController.getFeaturesHeading(plan.role)"
      :active="signupStore.selectedPlan.role === plan.role"
      @selected="signupStore.selectPlan(plan.role)"
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
</template>

<style scoped></style>
