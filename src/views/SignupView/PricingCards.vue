<script setup lang="ts">
import PricingCard from '@/components/cards/PricingCard.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import { useSignupStore } from '@/stores/signupStore'
import type { SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'

const signupStore = useSignupStore()
const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()
</script>

<template>
  <PricingCard
    v-for="plan in signupPlans"
    :key="plan.role"
    :plan-name="plan.name"
    :pricing="plan.cost.toString()"
    @selected="signupStore.selectPlan(plan.role)"
  >
    <template #list>
      <CheckListItem :line-through="false" :is-checked="plan.allowedReviewerAccess"
        >Allowed Reviewer Access</CheckListItem
      >
      <CheckListItem :line-through="false" :is-checked="plan.giveReviewerFeedback"
        >Give Reviewer Feedback</CheckListItem
      >
      <CheckListItem :line-through="false" :is-checked="plan.bookmarkReviewer"
        >Bookmark Reviewers</CheckListItem
      >
      <CheckListItem :line-through="true" :is-checked="plan.addYourReviews"
        >Add Your Reviews</CheckListItem
      >
      <CheckListItem :line-through="true" :is-checked="plan.metricAnalysis"
        >Metric analysis</CheckListItem
      >
      <CheckListItem :line-through="true" :is-checked="plan.patreonSupport"
        >Patreon Support</CheckListItem
      >
      <CheckListItem :line-through="true" :is-checked="plan.vinmeo">Vinmeo</CheckListItem>
      <CheckListItem :line-through="true" :is-checked="plan.twitter">Twitter</CheckListItem>
    </template>
  </PricingCard>
</template>

<style scoped></style>
