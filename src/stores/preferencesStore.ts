import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    reviews: boolean
    videoUpdates: boolean
    weeklyDigest: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    dateFormat: string
  }
  privacy: {
    profileVisibility: 'public' | 'members' | 'private'
    showEmail: boolean
    showActivity: boolean
    allowMessages: boolean
  }
  content: {
    autoplayVideos: boolean
    showMatureContent: boolean
    defaultVideoQuality: string
    subtitlesEnabled: boolean
  }
  security: {
    loginNotifications: boolean
    suspiciousActivityAlerts: boolean
    passwordExpiry: boolean
    sessionTimeout: number
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  // State
  const preferences = ref<UserPreferences | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const notificationPreferences = computed(() => preferences.value?.notifications)
  const displayPreferences = computed(() => preferences.value?.display)
  const privacyPreferences = computed(() => preferences.value?.privacy)
  const contentPreferences = computed(() => preferences.value?.content)
  const securityPreferences = computed(() => preferences.value?.security)

  // Actions
  const fetchPreferences = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/preferences`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }

      const data = await response.json()

      if (data.status === 'success') {
        preferences.value = data.data.preferences
      } else {
        throw new Error(data.message || 'Failed to fetch preferences')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch preferences'
      console.error('Error fetching preferences:', err)
    } finally {
      loading.value = false
    }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/preferences`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updates)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update preferences')
      }

      const data = await response.json()

      if (data.status === 'success') {
        preferences.value = data.data.preferences
        return data.data.preferences
      } else {
        throw new Error(data.message || 'Failed to update preferences')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update preferences'
      console.error('Error updating preferences:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    preferences.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    preferences,
    loading,
    error,
    
    // Computed
    notificationPreferences,
    displayPreferences,
    privacyPreferences,
    contentPreferences,
    securityPreferences,
    
    // Actions
    fetchPreferences,
    updatePreferences,
    clearError,
    reset
  }
})
