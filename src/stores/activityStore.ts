import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Activity {
  id: string
  userId: string
  type: 'review' | 'video_view' | 'profile_update' | 'login' | 'signup'
  title: string
  description?: string
  metadata?: any
  timestamp: string
}

export interface ActivityStats {
  totalReviews: number
  totalVideoViews: number
  thisWeekActivity: number
}

export const useActivityStore = defineStore('activity', () => {
  // State
  const activities = ref<Activity[]>([])
  const stats = ref<ActivityStats>({
    totalReviews: 0,
    totalVideoViews: 0,
    thisWeekActivity: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const hasMore = ref(false)

  // Computed
  const activityCount = computed(() => activities.value.length)
  
  const activitiesByType = computed(() => {
    return (type: Activity['type']) => activities.value.filter(a => a.type === type)
  })

  // Actions
  const fetchActivity = async (options?: {
    limit?: number
    offset?: number
    type?: string[]
  }) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams({
        limit: String(options?.limit || 20),
        offset: String(options?.offset || 0)
      })
      
      if (options?.type && options.type.length > 0) {
        params.append('type', options.type.join(','))
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/activity?${params}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch activity')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // If offset is 0, replace activities, otherwise append
        if (options?.offset === 0 || !options?.offset) {
          activities.value = data.data.activities
        } else {
          activities.value = [...activities.value, ...data.data.activities]
        }
        
        stats.value = data.data.stats
        total.value = data.data.total
        hasMore.value = data.data.hasMore
      } else {
        throw new Error(data.message || 'Failed to fetch activity')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch activity'
      console.error('Error fetching activity:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    
    await fetchActivity({
      limit: 20,
      offset: activities.value.length
    })
  }

  const filterByType = async (types: Activity['type'][]) => {
    await fetchActivity({
      limit: 20,
      offset: 0,
      type: types
    })
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    activities.value = []
    stats.value = {
      totalReviews: 0,
      totalVideoViews: 0,
      thisWeekActivity: 0
    }
    loading.value = false
    error.value = null
    total.value = 0
    hasMore.value = false
  }

  return {
    // State
    activities,
    stats,
    loading,
    error,
    total,
    hasMore,
    
    // Computed
    activityCount,
    activitiesByType,
    
    // Actions
    fetchActivity,
    loadMore,
    filterByType,
    clearError,
    reset
  }
})
