import { defineStore } from 'pinia'
import { computed, ref, type Ref, watchEffect } from 'vue'
import type { Profile } from '@/types'
import reviewerController from '@/controllers/reviewerController'
import * as userService from '@/services/UserService'
import { useUserStore } from '@/stores/userStore'
import { useVideosStore } from '@/stores/videosStore'
import { useMetricsStore } from '@/stores/metricsStore'

const RolesConfig = [
  {
    type: 'user',
    value: '👤User'
  },
  {
    type: 'reviewer-basic',
    value: '⭐Reviewer'
  },
  {
    type: 'reviewer-plus',
    value: '✨Reviewer Plus'
  }
] as const

const RolesMap = new Map<string, { type: string; value: string }>(
  RolesConfig.map((role) => [role.type, role])
)

export const useProfileStore = defineStore('useProfileStore', () => {
  const userStore = useUserStore()
  const videosStore = useVideosStore()
  const metricsStore = useMetricsStore()

  const hasProfileLoaded = ref(false)
  const status = ref('loading')
  const profile: Ref<Profile> = ref({
    id: '',
    name: 'Loading',
    email: '',
    role: '',
    createdAt: '',
    youTubeChannelId: ''
  })

  // Computed
  const getInitials = computed(() => {
    return reviewerController.getInitials(profile.value.name)
  })

  const getRole = computed(() => {
    if (RolesMap.has(profile.value.role)) return RolesMap.get(profile.value.role)?.value
    return RolesConfig[0].value
  })

  const getIsReviewer = computed(() => {
    return ['reviewer-basic', 'reviewer-plus'].includes(profile.value.role)
  })

  const setProfile = async (name: string) => {
    if (!name) return undefined

    try {
      hasProfileLoaded.value = false
      const user = await userService.getProfile(name)
      profile.value.role = user.role
      profile.value.createdAt = String(user.createdAt)
      profile.value.id = user._id
      profile.value.email = user.email ?? ''
      profile.value.name = user.name ?? ''
      profile.value.youTubeChannelId = user.youTubeChannelId ?? ''

      await videosStore.setProfile(profile)
      await metricsStore.updateMetrics(profile)
    } catch (error: unknown) {
      console.error(error)
    } finally {
      hasProfileLoaded.value = true
    }
  }

  watchEffect(async () => await setProfile(userStore.user.name))

  return {
    profile,
    hasProfileLoaded,
    getInitials,
    getIsReviewer,
    getRole,
    status,
    setProfile
  }
})
