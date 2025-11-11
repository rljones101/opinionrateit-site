import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ReviewReply {
  id: string
  reviewId: string
  userId: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: string
  updatedAt: string
  parentReplyId?: string
  repliesCount?: number
}

export const useReviewInteractionsStore = defineStore('reviewInteractions', () => {
  // State
  const likes = ref(new Map<string, boolean>())
  const likeCounts = ref(new Map<string, number>())
  const replies = ref(new Map<string, ReviewReply[]>())
  const replyCounts = ref(new Map<string, number>())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions - Likes
  const likeReview = async (reviewId: string) => {
    // Optimistic update
    const wasLiked = likes.value.get(reviewId) || false
    const currentCount = likeCounts.value.get(reviewId) || 0
    
    likes.value.set(reviewId, true)
    likeCounts.value.set(reviewId, currentCount + 1)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/review-interactions/${reviewId}/like`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to like review')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        likeCounts.value.set(reviewId, data.data.likesCount)
      } else {
        throw new Error(data.message || 'Failed to like review')
      }
    } catch (err: any) {
      // Revert optimistic update
      likes.value.set(reviewId, wasLiked)
      likeCounts.value.set(reviewId, currentCount)
      error.value = err.message || 'Failed to like review'
      console.error('Error liking review:', err)
      throw err
    }
  }

  const unlikeReview = async (reviewId: string) => {
    // Optimistic update
    const wasLiked = likes.value.get(reviewId) || false
    const currentCount = likeCounts.value.get(reviewId) || 0
    
    likes.value.set(reviewId, false)
    likeCounts.value.set(reviewId, Math.max(0, currentCount - 1))

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/review-interactions/${reviewId}/like`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to unlike review')
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        likeCounts.value.set(reviewId, data.data.likesCount)
      } else {
        throw new Error(data.message || 'Failed to unlike review')
      }
    } catch (err: any) {
      // Revert optimistic update
      likes.value.set(reviewId, wasLiked)
      likeCounts.value.set(reviewId, currentCount)
      error.value = err.message || 'Failed to unlike review'
      console.error('Error unliking review:', err)
      throw err
    }
  }

  const isReviewLiked = (reviewId: string): boolean => {
    return likes.value.get(reviewId) || false
  }

  const getLikeCount = (reviewId: string): number => {
    return likeCounts.value.get(reviewId) || 0
  }

  const setLikeState = (reviewId: string, isLiked: boolean, count: number) => {
    likes.value.set(reviewId, isLiked)
    likeCounts.value.set(reviewId, count)
  }

  // Actions - Replies
  const fetchReplies = async (reviewId: string, options?: {
    limit?: number
    offset?: number
    sort?: 'newest' | 'oldest'
  }) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams({
        limit: String(options?.limit || 10),
        offset: String(options?.offset || 0),
        sort: options?.sort || 'newest'
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/review-interactions/${reviewId}/replies?${params}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch replies')
      }

      const data = await response.json()

      if (data.status === 'success') {
        replies.value.set(reviewId, data.data.replies)
        replyCounts.value.set(reviewId, data.data.total)
      } else {
        throw new Error(data.message || 'Failed to fetch replies')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch replies'
      console.error('Error fetching replies:', err)
    } finally {
      loading.value = false
    }
  }

  const addReply = async (reviewId: string, content: string, parentReplyId?: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/review-interactions/${reviewId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ content, parentReplyId })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add reply')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Add reply to local state
        const currentReplies = replies.value.get(reviewId) || []
        replies.value.set(reviewId, [data.data.reply, ...currentReplies])
        
        // Update count
        const currentCount = replyCounts.value.get(reviewId) || 0
        replyCounts.value.set(reviewId, currentCount + 1)
        
        return data.data.reply
      } else {
        throw new Error(data.message || 'Failed to add reply')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to add reply'
      console.error('Error adding reply:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReply = async (replyId: string, reviewId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/review-interactions/${reviewId}/replies/${replyId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete reply')
      }

      const data = await response.json()

      if (data.status === 'success') {
        // Remove reply from local state
        const currentReplies = replies.value.get(reviewId) || []
        replies.value.set(reviewId, currentReplies.filter(r => r.id !== replyId))
        
        // Update count
        const currentCount = replyCounts.value.get(reviewId) || 0
        replyCounts.value.set(reviewId, Math.max(0, currentCount - 1))
      } else {
        throw new Error(data.message || 'Failed to delete reply')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete reply'
      console.error('Error deleting reply:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getReplyCount = (reviewId: string): number => {
    return replyCounts.value.get(reviewId) || 0
  }

  const getReplies = (reviewId: string): ReviewReply[] => {
    return replies.value.get(reviewId) || []
  }

  const setReplyCount = (reviewId: string, count: number) => {
    replyCounts.value.set(reviewId, count)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    loading,
    error,
    
    // Like actions
    likeReview,
    unlikeReview,
    isReviewLiked,
    getLikeCount,
    setLikeState,
    
    // Reply actions
    fetchReplies,
    addReply,
    deleteReply,
    getReplyCount,
    getReplies,
    setReplyCount,
    
    // Utility
    clearError
  }
})
