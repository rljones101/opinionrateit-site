import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface WatchHistory {
  id: string
  userId: string
  videoId: string
  watchedAt: string
  watchDuration: number
  videoDuration: number
  lastPosition: number
  completed: boolean
  updatedAt: string
}

export interface WatchHistoryWithVideo extends WatchHistory {
  video: {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    channelId: string
    channelTitle: string
    duration?: string
    viewCount?: number
    publishedAt?: string
  }
  progressPercentage: number
}

export const useWatchHistoryStore = defineStore('watchHistory', () => {
  // State
  const history = ref<WatchHistoryWithVideo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const hasMore = ref(false)

  // Computed
  const historyCount = computed(() => history.value.length)
  
  const watchedVideoIds = computed(() => 
    new Set(history.value.map(h => h.videoId))
  )

  // Actions
  const fetchHistory = async (options?: {
    limit?: number
    offset?: number
    sort?: 'recent' | 'oldest'
    dateFilter?: 'today' | 'week' | 'month' | 'all'
  }) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams({
        limit: String(options?.limit || 20),
        offset: String(options?.offset || 0),
        sort: options?.sort || 'recent',
        dateFilter: options?.dateFilter || 'all'
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history?${params}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch watch history')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // If offset is 0, replace history, otherwise append
        if (options?.offset === 0 || !options?.offset) {
          history.value = data.data.history
        } else {
          history.value = [...history.value, ...data.data.history]
        }
        
        total.value = data.data.total
        hasMore.value = data.data.hasMore
      } else {
        throw new Error(data.message || 'Failed to fetch watch history')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch watch history'
      console.error('Error fetching watch history:', err)
    } finally {
      loading.value = false
    }
  }

  const trackWatch = async (
    videoId: string,
    watchDuration: number,
    videoDuration: number,
    lastPosition: number,
    completed: boolean
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            videoId,
            watchDuration,
            videoDuration,
            lastPosition,
            completed
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to track watch')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Refresh history to get updated data
        // Only refresh if we're on the history page (history.value has items)
        if (history.value.length > 0) {
          await fetchHistory({ limit: 20, offset: 0 })
        }
        return data.data.history
      } else {
        throw new Error(data.message || 'Failed to track watch')
      }
    } catch (err: any) {
      // Don't show error to user for tracking failures (silent fail)
      console.error('Error tracking watch:', err)
      throw err
    }
  }

  const updateProgress = async (
    historyId: string,
    watchDuration: number,
    lastPosition: number,
    completed: boolean
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history/${historyId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            watchDuration,
            lastPosition,
            completed
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update progress')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Update local state
        const index = history.value.findIndex(h => h.id === historyId)
        if (index !== -1) {
          history.value[index] = {
            ...history.value[index],
            watchDuration,
            lastPosition,
            completed,
            progressPercentage: Math.round((watchDuration / history.value[index].videoDuration) * 100)
          }
        }
        return data.data.history
      } else {
        throw new Error(data.message || 'Failed to update progress')
      }
    } catch (err: any) {
      console.error('Error updating progress:', err)
      throw err
    }
  }

  const removeHistoryItem = async (historyId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history/${historyId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove history item')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Remove from local state
        history.value = history.value.filter(h => h.id !== historyId)
        total.value = Math.max(0, total.value - 1)
      } else {
        throw new Error(data.message || 'Failed to remove history item')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to remove history item'
      console.error('Error removing history item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearHistory = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to clear history')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Clear local state
        history.value = []
        total.value = 0
        hasMore.value = false
      } else {
        throw new Error(data.message || 'Failed to clear history')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to clear history'
      console.error('Error clearing history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getLastPosition = async (videoId: string): Promise<{
    lastPosition: number
    shouldResume: boolean
    history: WatchHistory | null
  }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/watch-history/video/${videoId}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get last position')
      }

      const data = await response.json()

      if (data.status === 'success') {
        return {
          lastPosition: data.data.lastPosition || 0,
          shouldResume: data.data.shouldResume || false,
          history: data.data.history
        }
      } else {
        throw new Error(data.message || 'Failed to get last position')
      }
    } catch (err: any) {
      console.error('Error getting last position:', err)
      return {
        lastPosition: 0,
        shouldResume: false,
        history: null
      }
    }
  }

  const isVideoInHistory = (videoId: string): boolean => {
    return watchedVideoIds.value.has(videoId)
  }

  const getHistoryByVideoId = (videoId: string): WatchHistoryWithVideo | null => {
    return history.value.find(h => h.videoId === videoId) || null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    history.value = []
    loading.value = false
    error.value = null
    total.value = 0
    hasMore.value = false
  }

  return {
    // State
    history,
    loading,
    error,
    total,
    hasMore,
    
    // Computed
    historyCount,
    watchedVideoIds,
    
    // Actions
    fetchHistory,
    trackWatch,
    updateProgress,
    removeHistoryItem,
    clearHistory,
    getLastPosition,
    isVideoInHistory,
    getHistoryByVideoId,
    clearError,
    reset
  }
})
