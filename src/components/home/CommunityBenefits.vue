<script setup lang="ts">
// Community benefits — explains the concrete value of joining the community
// instead of showing placeholder vanity metrics. If a public stats endpoint
// is added later, a real numbers bar could complement this section.
import {
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  MegaphoneIcon
} from '@heroicons/vue/24/outline'

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: 'Trusted Reviews',
    description:
      'Reviews come from real people sharing honest opinions, not paid placements. Decide with confidence.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Learn First',
    description:
      'See what fellow buyers noticed before you spend. Ask questions and get answers from people who own the product.'
  },
  {
    icon: FunnelIcon,
    title: 'Less Noise',
    description:
      'Skip the endless scrolling. Community ratings surface the reviews worth your time.'
  },
  {
    icon: MegaphoneIcon,
    title: 'Your Voice',
    description:
      'Share your own experience and help the next person make a smarter choice. Build a reputation as a trusted reviewer.'
  }
]
</script>

<template>
  <div class="flex flex-col items-center">
    <h2 class="text-4xl text-center text-brand-300 uppercase">Better Together</h2>
    <p class="mt-3 mb-10 text-center text-default-300 max-w-2xl">
      A product is only as good as the people who stand behind it. Here's what you get when you
      review with the community.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <div
        v-for="benefit in benefits"
        :key="benefit.title"
        class="flex flex-col gap-3 bg-secondary-50 border border-app-light-blue p-6 rounded-lg h-full"
      >
        <div class="flex items-center gap-3">
          <component :is="benefit.icon" class="flex-shrink-0 w-8 h-8 text-brand-500" aria-hidden="true" />
          <h3 class="font-bold text-lg text-brand-300 whitespace-nowrap">{{ benefit.title }}</h3>
        </div>
        <p class="text-default-300 leading-relaxed">{{ benefit.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
