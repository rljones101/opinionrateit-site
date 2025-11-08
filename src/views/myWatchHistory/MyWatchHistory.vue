<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWatchHistoryStore } from '@/stores/watchHistoryStore'
import AppTitle from '@/components/AppTitle.vue'
import WatchHistoryList from '@/components/watchHistory/WatchHistoryList.vue'

const watchHistoryStore = useWatchHistoryStore()

const sortBy = ref<'recent' | 'oldest'>('recent')
const dateFilter = ref<'today' | 'week' | 'month' | 'all'>('all')

const historyCount = computed(() => watchHistoryStore.historyCount)

const handleSortChange = (newSort: 'recent' | 'oldest') => {
  sortBy.value = newSort
  watchHistoryStore.fetchHistory({
    sort: newSort,
    dateFilter: dateFilter.value,
    limit: 20,
    offset: 0
  })
}

const handleDateFilterChange = (newFilter: 'today' | 'week' | 'month' | 'all') => {
  dateFilter.value = newFilter
  watchHistoryStore.fetchHistory({
    sort: sortBy.value,
    dateFilter: newFilter,
    limit: 20,
    offset: 0
  })
}

const handleClearHistory = async () => {
  if (confirm('Are you sure you want to clear your entire watch history? This action cannot be undone.')) {
    try {
      await watchHistoryStore.clearHistory()
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }
}
</script>

<template>
  <div class="my-watch-history">
    <AppTitle>Watch History</AppTitle>

    <div class="history-container">
      <!-- Header -->
      <div class="history-header">
        <div class="header-info">
          <h1 class="page-title">Watch History</h1>
          <p v-if="historyCount > 0" class="history-count">
            {{ historyCount }} {{ historyCount === 1 ? 'video' : 'videos' }} watched
          </p>
        </div>

        <!-- Controls -->
        <div class="header-controls">
          <!-- Date Filter -->
          <div class="filter-container">
            <label for="dateFilter" class="filter-label">Show:</label>
            <select
              id="dateFilter"
              v-model="dateFilter"
              class="filter-select"
              @change="handleDateFilterChange(dateFilter)"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <!-- Sort -->
          <div class="sort-container">
            <label for="sort" class="sort-label">Sort by:</label>
            <select
              id="sort"
              v-model="sortBy"
              class="sort-select"
              @change="handleSortChange(sortBy)"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <!-- Clear History Button -->
          <button
            v-if="historyCount > 0"
            class="clear-button"
            @click="handleClearHistory"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear History
          </button>
        </div>
      </div>

      <!-- History List -->
      <div class="history-content">
        <WatchHistoryList :sort-by="sortBy" :date-filter="dateFilter" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.my-watch-history {
  @apply w-full h-full;
}

.history-container {
  @apply max-w-6xl mx-auto p-6;
}

.history-header {
  @apply mb-8 space-y-6;
}

.header-info {
  @apply space-y-2;
}

.page-title {
  @apply text-3xl font-bold text-gray-900;
}

.history-count {
  @apply text-gray-600;
}

.header-controls {
  @apply flex flex-wrap gap-4 items-center;
}

.filter-container,
.sort-container {
  @apply flex items-center gap-2;
}

.filter-label,
.sort-label {
  @apply text-sm font-medium text-gray-700 whitespace-nowrap;
}

.filter-select,
.sort-select {
  @apply px-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
  @apply bg-white cursor-pointer;
}

.clear-button {
  @apply ml-auto px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg;
  @apply hover:bg-red-100 transition-colors font-medium;
  @apply flex items-center gap-2;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}

.history-content {
  @apply min-h-96;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .history-container {
    @apply p-4;
  }

  .page-title {
    @apply text-2xl;
  }

  .header-controls {
    @apply flex-col items-stretch;
  }

  .filter-container,
  .sort-container {
    @apply flex-row justify-between;
  }

  .clear-button {
    @apply ml-0 justify-center;
  }
}
</style>
