<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { WatchHistoryWithVideo } from '@/stores/watchHistoryStore'
import { formatDate, timeAgo } from '@/utils/DateUtils'
import ProgressBar from '@/components/ui/ProgressBar.vue'

interface Props {
  historyItem: WatchHistoryWithVideo
}

const props = defineProps<Props>()
const router = useRouter()

const emit = defineEmits<{
  removed: [historyId: string]
}>()

const watchedDate = computed(() => {
  return formatDate(props.historyItem.watchedAt)
})

const watchedTimeAgo = computed(() => {
  return timeAgo(props.historyItem.watchedAt)
})

const isCompleted = computed(() => {
  return props.historyItem.completed || props.historyItem.progressPercentage >= 90
})

const progressColor = computed(() => {
  if (isCompleted.value) return 'green'
  if (props.historyItem.progressPercentage >= 50) return 'brand'
  return 'gray'
})

const handleClick = () => {
  // Navigate to video detail page
  router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: {
      channelId: props.historyItem.video.channelId,
      videoId: props.historyItem.video.id
    }
  })
}

const handleRemove = (event: Event) => {
  event.stopPropagation()
  if (confirm('Remove this video from your watch history?')) {
    emit('removed', props.historyItem.id)
  }
}
</script>

<template>
  <div class="watch-history-card">
    <div class="card-content" @click="handleClick">
      <!-- Thumbnail -->
      <div class="thumbnail-container">
        <img
          :src="historyItem.video.thumbnailUrl"
          :alt="historyItem.video.title"
          class="thumbnail"
        />
        
        <!-- Completion Badge -->
        <div v-if="isCompleted" class="completion-badge">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-xs">Completed</span>
        </div>
        
        <!-- Progress Overlay -->
        <div v-if="!isCompleted && historyItem.progressPercentage > 0" class="progress-overlay">
          <div class="progress-bar-mini" :style="{ width: `${historyItem.progressPercentage}%` }"></div>
        </div>
      </div>

      <!-- Video Info -->
      <div class="video-info">
        <h3 class="video-title">{{ historyItem.video.title }}</h3>
        
        <p class="channel-name">{{ historyItem.video.channelTitle }}</p>
        
        <div class="metadata">
          <span v-if="historyItem.video.viewCount" class="metadata-item">
            {{ historyItem.video.viewCount?.toLocaleString() }} views
          </span>
          <span v-if="historyItem.video.publishedAt" class="metadata-item">
            {{ formatDate(historyItem.video.publishedAt) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <ProgressBar
            :percentage="historyItem.progressPercentage"
            :color="progressColor"
            size="sm"
            :show-label="true"
          />
        </div>

        <!-- Watch Info -->
        <div class="watch-info">
          <svg class="watch-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="watch-date" :title="watchedDate">
            Watched {{ watchedTimeAgo }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <button
        class="remove-button"
        @click="handleRemove"
        title="Remove from history"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.watch-history-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden;
  @apply hover:shadow-md transition-shadow duration-200;
  @apply flex items-start gap-4 p-4;
}

.card-content {
  @apply flex-1 flex gap-4 cursor-pointer;
}

.thumbnail-container {
  @apply relative flex-shrink-0 w-48 h-28 bg-gray-200 rounded overflow-hidden;
}

.thumbnail {
  @apply w-full h-full object-cover;
}

.completion-badge {
  @apply absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1;
}

.progress-overlay {
  @apply absolute bottom-0 left-0 right-0 h-1 bg-gray-300;
}

.progress-bar-mini {
  @apply h-full bg-brand-500 transition-all duration-300;
}

.video-info {
  @apply flex-1 min-w-0 space-y-2;
}

.video-title {
  @apply text-base font-semibold text-gray-900 line-clamp-2;
}

.channel-name {
  @apply text-sm text-gray-600;
}

.metadata {
  @apply flex flex-wrap gap-2 text-xs text-gray-500;
}

.metadata-item:not(:last-child)::after {
  content: '•';
  @apply ml-2;
}

.progress-section {
  @apply py-1;
}

.watch-info {
  @apply flex items-center gap-2 text-xs text-gray-500;
}

.watch-icon {
  @apply w-4 h-4;
}

.watch-date {
  @apply font-medium;
}

.card-actions {
  @apply flex-shrink-0;
}

.remove-button {
  @apply p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .watch-history-card {
    @apply flex-col;
  }

  .card-content {
    @apply flex-col;
  }

  .thumbnail-container {
    @apply w-full h-48;
  }

  .card-actions {
    @apply self-end;
  }
}
</style>
