<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BookmarkWithVideo } from '@/stores/bookmarksStore'
import { formatDate, timeAgo } from '@/utils/DateUtils'
import BookmarkButton from './BookmarkButton.vue'

interface Props {
  bookmark: BookmarkWithVideo
}

const props = defineProps<Props>()
const router = useRouter()

const emit = defineEmits<{
  removed: [bookmarkId: string]
}>()

const bookmarkedDate = computed(() => {
  return formatDate(props.bookmark.createdAt)
})

const bookmarkedTimeAgo = computed(() => {
  return timeAgo(props.bookmark.createdAt)
})

const handleClick = () => {
  // Navigate to video detail page
  router.push({
    name: 'reviewers-channelId-reviews-videoId',
    params: {
      channelId: props.bookmark.video.channelId,
      videoId: props.bookmark.video.id
    }
  })
}

const handleRemoved = () => {
  emit('removed', props.bookmark.id)
}
</script>

<template>
  <div class="bookmarked-video-card">
    <div class="card-content" @click="handleClick">
      <!-- Thumbnail -->
      <div class="thumbnail-container">
        <img
          :src="bookmark.video.thumbnailUrl"
          :alt="bookmark.video.title"
          class="thumbnail"
        />
        
        <!-- Duration badge (if available) -->
        <div v-if="bookmark.video.duration" class="duration-badge">
          {{ bookmark.video.duration }}
        </div>
      </div>

      <!-- Video Info -->
      <div class="video-info">
        <h3 class="video-title">{{ bookmark.video.title }}</h3>
        
        <p class="channel-name">{{ bookmark.video.channelTitle }}</p>
        
        <div class="metadata">
          <span v-if="bookmark.video.viewCount" class="metadata-item">
            {{ bookmark.video.viewCount?.toLocaleString() }} views
          </span>
          <span v-if="bookmark.video.publishedAt" class="metadata-item">
            {{ formatDate(bookmark.video.publishedAt) }}
          </span>
        </div>

        <div class="bookmark-info">
          <svg class="bookmark-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span class="bookmark-date" :title="bookmarkedDate">
            Saved {{ bookmarkedTimeAgo }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <BookmarkButton
        :video-id="bookmark.videoId"
        size="md"
        @unbookmarked="handleRemoved"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.bookmarked-video-card {
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

.duration-badge {
  @apply absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded;
}

.video-info {
  @apply flex-1 min-w-0;
}

.video-title {
  @apply text-base font-semibold text-gray-900 mb-2 line-clamp-2;
}

.channel-name {
  @apply text-sm text-gray-600 mb-2;
}

.metadata {
  @apply flex flex-wrap gap-2 text-xs text-gray-500 mb-3;
}

.metadata-item:not(:last-child)::after {
  content: '•';
  @apply ml-2;
}

.bookmark-info {
  @apply flex items-center gap-2 text-xs text-brand-600;
}

.bookmark-icon {
  @apply w-4 h-4;
}

.bookmark-date {
  @apply font-medium;
}

.card-actions {
  @apply flex-shrink-0;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .bookmarked-video-card {
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
