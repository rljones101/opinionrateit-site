<script setup lang="ts">
import ValuePropositionCard from '@/components/home/ValuePropositionCard.vue'

const personas = [
  {
    emoji: '🔍',
    title: 'Discover Reviews',
    description:
      'Browse unlimited tech product reviews from trusted reviewers. Save your favorites and discover new products.',
    features: ['Browse all reviews', 'Save up to 10 favorites', 'Basic search', 'Watch videos']
  },
  {
    emoji: '✍️',
    title: 'Share Your Voice',
    description:
      'Post your own reviews, get feedback from the community, and build your reputation as a trusted reviewer.',
    features: [
      'Post unlimited reviews',
      'Follow reviewers',
      'Unlimited favorites',
      'Community engagement'
    ]
  },
  {
    emoji: '📊',
    title: 'Grow Your Channel',
    description:
      'Connect your YouTube channel, get detailed analytics, and understand what makes your reviews effective.',
    features: ['YouTube integration', 'Video reviews', 'Analytics dashboard', 'Performance metrics']
  }
]
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-4xl text-center text-brand-300 uppercase">Built for Every Tech Fan</h2>
    <p class="mt-3 mb-10 text-center text-default-300 max-w-2xl">
      Whether you want to discover great reviews or share your own, there's a place for you here.
    </p>
    <div class="flex flex-col md:flex-row gap-6 w-full items-stretch">
      <ValuePropositionCard
        v-for="persona in personas"
        :key="persona.title"
        :emoji="persona.emoji"
        :title="persona.title"
        :description="persona.description"
        :features="persona.features"
      />
    </div>
  </div>
</template>

<style scoped></style>
