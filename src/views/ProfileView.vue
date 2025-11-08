<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import AppTitle from '@/components/AppTitle.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileTabs from '@/components/profile/ProfileTabs.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'
import ProfileActivity from '@/components/profile/ProfileActivity.vue'
import ProfilePreferences from '@/components/profile/ProfilePreferences.vue'
import ProfileSecurity from '@/components/profile/ProfileSecurity.vue'

const userStore = useUserStore()
const router = useRouter()

const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
  { id: 'preferences', label: 'Preferences', icon: 'heart' },
  { id: 'security', label: 'Security', icon: 'shield' }
]

const loadProfile = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Check if user is authenticated
    if (!userStore.isAuthenticated) {
      router.push({ name: 'login' })
      return
    }

    // Load user profile data
    await userStore.fetchCurrentUser()

  } catch (err: any) {
    error.value = err.message || 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

const handleRetry = () => {
  loadProfile()
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="profile-view">
    <AppTitle>My Profile</AppTitle>

    <ErrorBoundary v-if="error" :error="error" @retry="handleRetry" />

    <LoadingState v-else-if="isLoading" message="Loading your profile..." />

    <div v-else class="profile-container">
      <!-- Profile Header -->
      <ProfileHeader :user="userStore.currentUser" />

      <!-- Profile Navigation Tabs -->
      <ProfileTabs :tabs="tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

      <!-- Profile Content -->
      <div class="profile-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileSettings :user="userStore.currentUser" :compact="true" />
            <ProfileActivity :user="userStore.currentUser" :compact="true" />
          </div>
        </div>

        <!-- Settings Tab -->
        <ProfileSettings v-else-if="activeTab === 'settings'" :user="userStore.currentUser" />

        <!-- Activity Tab -->
        <ProfileActivity v-else-if="activeTab === 'activity'" :user="userStore.currentUser" />

        <!-- Preferences Tab -->
        <ProfilePreferences v-else-if="activeTab === 'preferences'" :user="userStore.currentUser" />

        <!-- Security Tab -->
        <ProfileSecurity v-else-if="activeTab === 'security'" :user="userStore.currentUser" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-view {
  @apply max-w-6xl mx-auto p-6;
}

.profile-container {
  @apply space-y-6;
}

.profile-content {
  @apply min-h-96;
}

.tab-content {
  @apply animate-fade-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>