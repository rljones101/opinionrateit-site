import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Bookmark {
  id: string
  userId: string
  videoId: string
  createdAt: string
  updatedAt: string
}

export interface BookmarkWithVideo extends Bookmark {
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
}

interface BookmarksState {
  bookmarks: BookmarkWithVideo[]
  loading: boolean
  error: string | null
  total: number
  hasMore: boolean
}

export const useBookmarksStore = defineStore('bookmarks', () => {
  // State
  const bookmarks = ref<BookmarkWithVideo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const hasMore = ref(false)

  // Computed
  const bookmarkedVideoIds = computed(() => 
    new Set(bookmarks.value.map(b => b.videoId))
  )

  const bookmarkCount = computed(() => bookmarks.value.length)

  // Actions
  const fetchBookmarks = async (options?: {
    limit?: number
    offset?: number
    sort?: 'newest' | 'oldest' | 'title'
  }) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams({
        limit: String(options?.limit || 20),
        offset: String(options?.offset || 0),
        sort: options?.sort || 'newest'
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookmarks?${params}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // If offset is 0, replace bookmarks, otherwise append
        if (options?.offset === 0 || !options?.offset) {
          bookmarks.value = data.data.bookmarks
        } else {
          bookmarks.value = [...bookmarks.value, ...data.data.bookmarks]
        }
        
        total.value = data.data.total
        hasMore.value = data.data.hasMore
      } else {
        throw new Error(data.message || 'Failed to fetch bookmarks')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookmarks'
      console.error('Error fetching bookmarks:', err)
    } finally {
      loading.value = false
    }
  }

  const addBookmark = async (videoId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookmarks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ videoId })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add bookmark')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Refresh bookmarks to get the full data with video details
        await fetchBookmarks({ limit: 20, offset: 0 })
        return data.data.bookmark
      } else {
        throw new Error(data.message || 'Failed to add bookmark')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to add bookmark'
      console.error('Error adding bookmark:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeBookmark = async (bookmarkId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookmarks/${bookmarkId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove bookmark')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Remove from local state
        bookmarks.value = bookmarks.value.filter(b => b.id !== bookmarkId)
        total.value = Math.max(0, total.value - 1)
      } else {
        throw new Error(data.message || 'Failed to remove bookmark')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to remove bookmark'
      console.error('Error removing bookmark:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeBookmarkByVideoId = async (videoId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookmarks/video/${videoId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove bookmark')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Remove from local state
        bookmarks.value = bookmarks.value.filter(b => b.videoId !== videoId)
        total.value = Math.max(0, total.value - 1)
      } else {
        throw new Error(data.message || 'Failed to remove bookmark')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to remove bookmark'
      console.error('Error removing bookmark:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const isVideoBookmarked = (videoId: string): boolean => {
    return bookmarkedVideoIds.value.has(videoId)
  }

  const getBookmarkByVideoId = (videoId: string): BookmarkWithVideo | null => {
    return bookmarks.value.find(b => b.videoId === videoId) || null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    bookmarks.value = []
    loading.value = false
    error.value = null
    total.value = 0
    hasMore.value = false
  }

  return {
    // State
    bookmarks,
    loading,
    error,
    total,
    hasMore,
    
    // Computed
    bookmarkedVideoIds,
    bookmarkCount,
    
    // Actions
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    removeBookmarkByVideoId,
    isVideoBookmarked,
    getBookmarkByVideoId,
    clearError,
    reset
  }
})
