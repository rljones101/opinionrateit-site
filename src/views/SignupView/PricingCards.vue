<script setup lang="ts">
import PricingCard from '@/components/cards/PricingCard.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import { useSignupStore } from '@/stores/signupStore'
import type { SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'

const signupStore = useSignupStore()
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
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
    <PricingCard
      v-for="plan in signupPlans"
      :key="plan.role"
      :plan-name="plan.name"
      :pricing="plan.cost > 0 ? plan.cost.toString() : undefined"
      :active="signupStore.selectedPlan.role === plan.role"
      @selected="signupStore.selectPlan(plan.role)"
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
