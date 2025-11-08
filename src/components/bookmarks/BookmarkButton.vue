<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookmarksStore } from '@/stores/bookmarksStore'

interface Props {
  videoId: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon-only' | 'with-text'
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'icon-only',
  showCount: false
})

const emit = defineEmits<{
  bookmarked: [videoId: string]
  unbookmarked: [videoId: string]
  error: [message: string]
}>()

const bookmarksStore = useBookmarksStore()
const isProcessing = ref(false)

const isBookmarked = computed(() => 
  bookmarksStore.isVideoBookmarked(props.videoId)
)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})

const buttonClasses = computed(() => {
  const base = 'bookmark-button transition-all duration-200'
  const sizeClass = props.size === 'sm' ? 'p-1' : props.size === 'lg' ? 'p-3' : 'p-2'
  const stateClass = isBookmarked.value 
    ? 'text-red-500 hover:text-red-600' 
    : 'text-gray-400 hover:text-red-500'
  
  return `${base} ${sizeClass} ${stateClass}`
})

const handleClick = async () => {
  if (isProcessing.value) return

  try {
    isProcessing.value = true

    if (isBookmarked.value) {
      // Remove bookmark
      await bookmarksStore.removeBookmarkByVideoId(props.videoId)
      emit('unbookmarked', props.videoId)
    } else {
      // Add bookmark
      await bookmarksStore.addBookmark(props.videoId)
      emit('bookmarked', props.videoId)
    }
  } catch (error: any) {
    const message = error.message || 'Failed to update bookmark'
    emit('error', message)
    console.error('Bookmark error:', error)
  } finally {
    isProcessing.value = false
  }
}

// Load bookmarks on mount if not already loaded
onMounted(() => {
  if (bookmarksStore.bookmarks.length === 0 && !bookmarksStore.loading) {
    bookmarksStore.fetchBookmarks({ limit: 100 })
  }
})
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="isProcessing"
    :title="isBookmarked ? 'Remove from favorites' : 'Add to favorites'"
    @click.stop="handleClick"
    type="button"
  >
    <!-- Loading spinner -->
    <svg
      v-if="isProcessing"
      :class="sizeClasses"
      class="animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Heart icon (filled when bookmarked) -->
    <svg
      v-else
      :class="sizeClasses"
      :fill="isBookmarked ? 'currentColor' : 'none'"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>

    <!-- Text label (optional) -->
    <span v-if="variant === 'with-text'" class="ml-2 text-sm font-medium">
      {{ isBookmarked ? 'Saved' : 'Save' }}
    </span>

    <!-- Count (optional) -->
    <span v-if="showCount && bookmarksStore.bookmarkCount > 0" class="ml-1 text-xs">
      ({{ bookmarksStore.bookmarkCount }})
    </span>
  </button>
</template>

<style scoped>
@reference "#main.css";

.bookmark-button {
  @apply inline-flex items-center justify-center rounded-full;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.bookmark-button:hover:not(:disabled) {
  @apply bg-gray-100;
}

.bookmark-button:active:not(:disabled) {
  @apply scale-95;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
