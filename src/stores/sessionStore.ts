import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Session {
  id: string
  device: string
  browser: string
  os?: string
  location: string
  ipAddress: string
  lastActive: string
  createdAt: string
  current: boolean
}

export const useSessionStore = defineStore('session', () => {
  // State
  const sessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const sessionCount = computed(() => sessions.value.length)
  const currentSession = computed(() => sessions.value.find(s => s.current))
  const otherSessions = computed(() => sessions.value.filter(s => !s.current))

  // Actions
  const fetchSessions = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/sessions`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }

      const data = await response.json()

      if (data.status === 'success') {
        sessions.value = data.data.sessions
      } else {
        throw new Error(data.message || 'Failed to fetch sessions')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch sessions'
      console.error('Error fetching sessions:', err)
    } finally {
      loading.value = false
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/sessions/${sessionId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to revoke session')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Remove session from local state
        sessions.value = sessions.value.filter(s => s.id !== sessionId)
      } else {
        throw new Error(data.message || 'Failed to revoke session')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to revoke session'
      console.error('Error revoking session:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const revokeAllSessions = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/me/sessions`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to revoke all sessions')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Keep only current session
        sessions.value = sessions.value.filter(s => s.current)
      } else {
        throw new Error(data.message || 'Failed to revoke all sessions')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to revoke all sessions'
      console.error('Error revoking all sessions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    sessions.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    sessions,
    loading,
    error,
    
    // Computed
    sessionCount,
    currentSession,
    otherSessions,
    
    // Actions
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    clearError,
    reset
  }
})
