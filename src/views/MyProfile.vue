<script setup lang="ts">
import { useProfile } from '@/composables/useProfile'
import { formatDate } from '@/utils/DateUtils'
import { useUserStore } from '@/stores/user'

// Import components
import AppTitle from '@/components/AppTitle.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
// Import types

// Import controllers or other utils

// Variables

// Reactive variables
const userStore = useUserStore()

// Template refs

// Composables
const { profile } = useProfile()

const getRole = (role: string) => {
  if (role === 'user') {
    return 'User'
  } else if (role === 'reviewer-basic') {
    return 'Reviewer'
  } else if (role === 'reviewer-plus') {
    return 'Reviewer Plus'
  }
}

// Static methods
</script>

<template>
  <div class="w-full h-full relative">
    <!-- content here --->
    <AppTitle>My Profile</AppTitle>
    <div class="app-card p-8 mt-8 space-y-8">
      <div class="border-b border-b-app-blue pb-8 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UserAvatar
            :name="userStore.user.name"
            :src="userStore.user.avatar"
            class="block w-10 h-10"
          />
          <p class="text-3xl">{{ profile.name }}</p>
        </div>
        <BaseButton
          class="border border-app-orange text-app-orange hover:bg-app-orange hover:text-white"
          >Edit</BaseButton
        >
      </div>
      <p class="flex flex-col">
        <span class="profile-label flex-1">Created On:</span
        ><span class="profile-user-value flex-1">{{ formatDate(profile.createdAt) }}</span>
      </p>
      <!--      <p class="flex flex-col">-->
      <!--        <span class="profile-label flex-1">Name:</span-->
      <!--        ><span class="profile-user-value flex-1">{{ profile.name }}</span>-->
      <!--      </p>-->
      <p class="flex flex-col">
        <span class="profile-label flex-1">Email:</span
        ><span class="profile-user-value flex-1">{{ profile.email }}</span>
      </p>
      <p class="flex flex-col">
        <span class="profile-label flex-1">Account type:</span
        ><span class="profile-user-value flex-1">{{ getRole(profile.role) }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.profile-label {
}
.profile-user-value {
  font-weight: bold;
  color: #ffffff;
}
</style>
