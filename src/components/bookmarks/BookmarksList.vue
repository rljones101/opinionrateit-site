<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import BookmarkedVideoCard from './BookmarkedVideoCard.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

interface Props {
  sortBy?: 'newest' | 'oldest' | 'title'
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  sortBy: 'newest',
  searchQuery: ''
})

const bookmarksStore = useBookmarksStore()
const isLoadingMore = ref(false)

const filteredBookmarks = computed(() => {
  let filtered = [...bookmarksStore.bookmarks]

  // Client-side search (for MVP)
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(bookmark =>
      bookmark.video.title.toLowerCase().includes(query) ||
      bookmark.video.channelTitle.toLowerCase().includes(query) ||
      bookmark.video.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const hasBookmarks = computed(() => filteredBookmarks.value.length > 0)

const loadMore = async () => {
  if (isLoadingMore.value || !bookmarksStore.hasMore) return

  try {
    isLoadingMore.value = true
    await bookmarksStore.fetchBookmarks({
      limit: 20,
      offset: bookmarksStore.bookmarks.length,
      sort: props.sortBy
    })
  } catch (error) {
    console.error('Error loading more bookmarks:', error)
  } finally {
    isLoadingMore.value = false
  }
}

const handleBookmarkRemoved = (bookmarkId: string) => {
  // The bookmark is already removed from the store by the BookmarkButton
  console.log('Bookmark removed:', bookmarkId)
}

onMounted(() => {
  if (bookmarksStore.bookmarks.length === 0) {
    bookmarksStore.fetchBookmarks({ sort: props.sortBy })
  }
})
</script>

<template>
  <div class="bookmarks-list">
    <!-- Loading State -->
    <LoadingState
      v-if="bookmarksStore.loading && bookmarksStore.bookmarks.length === 0"
      message="Loading your favorites..."
    />

    <!-- Error State -->
    <div v-else-if="bookmarksStore.error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="error-message">{{ bookmarksStore.error }}</p>
      <button class="retry-button" @click="bookmarksStore.fetchBookmarks({ sort: sortBy })">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasBookmarks && !searchQuery" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <h3 class="empty-title">No favorites yet</h3>
      <p class="empty-description">
        Start bookmarking videos you want to watch later or reference again.
      </p>
      <router-link to="/access/videos" class="browse-button">
        Browse Videos
      </router-link>
    </div>

    <!-- No Search Results -->
    <div v-else-if="!hasBookmarks && searchQuery" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 class="empty-title">No results found</h3>
      <p class="empty-description">
        Try adjusting your search to find what you're looking for.
      </p>
    </div>

    <!-- Bookmarks List -->
    <div v-else class="bookmarks-grid">
      <BookmarkedVideoCard
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @removed="handleBookmarkRemoved"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasBookmarks && bookmarksStore.hasMore" class="load-more-container">
      <button
        class="load-more-button"
        :disabled="isLoadingMore"
        @click="loadMore"
      >
        <span v-if="isLoadingMore">Loading...</span>
        <span v-else>Load More</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.bookmarks-list {
  @apply space-y-4;
}

.error-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.error-icon {
  @apply w-16 h-16 text-red-500 mb-4;
}

.error-message {
  @apply text-gray-700 mb-4;
}

.retry-button {
  @apply px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-icon {
  @apply w-20 h-20 text-gray-400 mb-4;
}

.empty-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6 max-w-md;
}

.browse-button {
  @apply px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium;
}

.bookmarks-grid {
  @apply space-y-4;
}

.load-more-container {
  @apply flex justify-center pt-6;
}

.load-more-button {
  @apply px-6 py-3 bg-white border-2 border-brand-500 text-brand-500 rounded-lg;
  @apply hover:bg-brand-50 transition-colors font-medium;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
