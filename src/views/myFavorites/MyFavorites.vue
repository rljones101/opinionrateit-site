<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import AppTitle from '@/components/AppTitle.vue'
import BookmarksList from '@/components/bookmarks/BookmarksList.vue'

const bookmarksStore = useBookmarksStore()

const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')
const searchQuery = ref('')

const bookmarkCount = computed(() => bookmarksStore.bookmarkCount)

const handleSortChange = (newSort: 'newest' | 'oldest' | 'title') => {
  sortBy.value = newSort
  bookmarksStore.fetchBookmarks({ sort: newSort, limit: 20, offset: 0 })
}
</script>

<template>
  <div class="my-favorites">
    <AppTitle>My Favorites</AppTitle>

    <div class="favorites-container">
      <!-- Header -->
      <div class="favorites-header">
        <div class="header-info">
          <h1 class="page-title">My Favorites</h1>
          <p v-if="bookmarkCount > 0" class="bookmark-count">
            {{ bookmarkCount }} {{ bookmarkCount === 1 ? 'video' : 'videos' }} saved
          </p>
        </div>

        <!-- Controls -->
        <div class="header-controls">
          <!-- Search -->
          <div class="search-container">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search favorites..."
              class="search-input"
            />
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
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bookmarks List -->
      <div class="favorites-content">
        <BookmarksList :sort-by="sortBy" :search-query="searchQuery" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.my-favorites {
  @apply w-full h-full;
}

.favorites-container {
  @apply max-w-6xl mx-auto p-6;
}

.favorites-header {
  @apply mb-8 space-y-6;
}

.header-info {
  @apply space-y-2;
}

.page-title {
  @apply text-3xl font-bold text-gray-900;
}

.bookmark-count {
  @apply text-gray-600;
}

.header-controls {
  @apply flex flex-col sm:flex-row gap-4;
}

.search-container {
  @apply relative flex-1;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.sort-container {
  @apply flex items-center gap-2;
}

.sort-label {
  @apply text-sm font-medium text-gray-700 whitespace-nowrap;
}

.sort-select {
  @apply px-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
  @apply bg-white cursor-pointer;
}

.favorites-content {
  @apply min-h-96;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .favorites-container {
    @apply p-4;
  }

  .page-title {
    @apply text-2xl;
  }

  .header-controls {
    @apply flex-col;
  }

  .sort-container {
    @apply flex-row justify-between;
  }
}
</style>
