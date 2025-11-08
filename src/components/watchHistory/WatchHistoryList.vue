<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWatchHistoryStore } from '@/stores/watchHistoryStore'
import WatchHistoryCard from './WatchHistoryCard.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

interface Props {
  sortBy?: 'recent' | 'oldest'
  dateFilter?: 'today' | 'week' | 'month' | 'all'
}

const props = withDefaults(defineProps<Props>(), {
  sortBy: 'recent',
  dateFilter: 'all'
})

const watchHistoryStore = useWatchHistoryStore()
const isLoadingMore = ref(false)

const hasHistory = computed(() => watchHistoryStore.history.length > 0)

const loadMore = async () => {
  if (isLoadingMore.value || !watchHistoryStore.hasMore) return

  try {
    isLoadingMore.value = true
    await watchHistoryStore.fetchHistory({
      limit: 20,
      offset: watchHistoryStore.history.length,
      sort: props.sortBy,
      dateFilter: props.dateFilter
    })
  } catch (error) {
    console.error('Error loading more history:', error)
  } finally {
    isLoadingMore.value = false
  }
}

const handleHistoryRemoved = async (historyId: string) => {
  try {
    await watchHistoryStore.removeHistoryItem(historyId)
  } catch (error) {
    console.error('Error removing history item:', error)
  }
}

onMounted(() => {
  if (watchHistoryStore.history.length === 0) {
    watchHistoryStore.fetchHistory({
      sort: props.sortBy,
      dateFilter: props.dateFilter
    })
  }
})
</script>

<template>
  <div class="watch-history-list">
    <!-- Loading State -->
    <LoadingState
      v-if="watchHistoryStore.loading && watchHistoryStore.history.length === 0"
      message="Loading your watch history..."
    />

    <!-- Error State -->
    <div v-else-if="watchHistoryStore.error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="error-message">{{ watchHistoryStore.error }}</p>
      <button
        class="retry-button"
        @click="watchHistoryStore.fetchHistory({ sort: sortBy, dateFilter })"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasHistory" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="empty-title">No watch history yet</h3>
      <p class="empty-description">
        Videos you watch will appear here so you can easily find them again.
      </p>
      <router-link to="/access/videos" class="browse-button">
        Browse Videos
      </router-link>
    </div>

    <!-- History List -->
    <div v-else class="history-grid">
      <WatchHistoryCard
        v-for="item in watchHistoryStore.history"
        :key="item.id"
        :history-item="item"
        @removed="handleHistoryRemoved"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasHistory && watchHistoryStore.hasMore" class="load-more-container">
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

.watch-history-list {
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

.history-grid {
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
