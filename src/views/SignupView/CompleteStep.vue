<script setup lang="ts">
import { SIGNUP_STEPS } from '@/types'
import { useSignupStore } from '@/stores/signupStore'
import { useUserStore } from '@/stores/userStore'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'

const signupStore = useSignupStore()
const userStore = useUserStore()
const router = useRouter()

const goToVideos = () => router.push({ name: 'videos' })
</script>

<template>
  <div
    key="complete"
    v-if="signupStore.currentStep === SIGNUP_STEPS.COMPLETE"
    class="w-full px-8 flex flex-col items-center text-center py-8 gap-4"
  >
    <!-- Success check -->
    <div class="flex items-center justify-center w-16 h-16 rounded-full bg-brand-500/15 border border-brand-500">
      <svg class="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <h2 class="text-2xl font-bold text-default-50">You're all set{{ userStore.user.name ? `, ${userStore.user.name}` : '' }}!</h2>
    <p class="text-default-300 max-w-md">
      Your account is ready. You can now browse reviews, save favorites, and share your own honest
      opinions with the community.
    </p>

    <BaseButton variant="primary" class="mt-4" @click="goToVideos">Browse Videos</BaseButton>
  </div>
</template>

<style scoped></style>
