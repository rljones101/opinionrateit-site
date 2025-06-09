<script setup lang="ts">
import { useProfile } from '@/composables/useProfile'
import { formatDate } from '@/utils/DateUtils'
import { useUserStore } from '@/stores/user'

// Import components
import AppTitle from '@/components/AppTitle.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const userStore = useUserStore()
const { profile } = useProfile(userStore.user.name)

const getRole = (role: string): string => {
  if (role === 'user') {
    return '👤User'
  } else if (role === 'reviewer-basic') {
    return '⭐Reviewer'
  } else if (role === 'reviewer-plus') {
    return '✨Reviewer Plus'
  }
  return ''
}
</script>

<template>
  <div class="w-full h-full relative">
    <!-- content here --->
    <AppTitle>My Profile</AppTitle>
    <div class="app-card p-8 space-y-2">
      <div class="border-b-2 border-b-brand-800 pb-8 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UserAvatar
            :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
            class="block w-10 h-10"
          />
          <p class="text-2xl text-brand-800 font-bold">{{ profile.name }}</p>
        </div>
        <BaseButton type="secondary">Edit</BaseButton>
      </div>
      <p class="flex flex-col">
        <span class="profile-label">Created On:</span
        ><span class="profile-user-value flex-1 font-semibold text-brand-800">{{
          formatDate(profile.createdAt)
        }}</span>
      </p>
      <!--      <p class="flex flex-col">-->
      <!--        <span class="profile-label flex-1">Name:</span-->
      <!--        ><span class="profile-user-value flex-1">{{ profile.name }}</span>-->
      <!--      </p>-->
      <p class="flex flex-col">
        <span class="profile-label">Email:</span
        ><span class="profile-user-value flex-1 font-semibold text-brand-800">{{
          profile.email
        }}</span>
      </p>
      <div class="flex flex-col">
        <p class="profile-label">Account type:</p>
        <p class="font-semibold text-brand-800">{{ getRole(profile.role) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
