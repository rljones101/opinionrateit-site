<script setup lang="ts">
import type { Video } from '@/types'
import AppCard from '@/components/cards/AppCard.vue'

defineProps<{
  video: Video
}>()

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-video.jpg' // Fallback image
}

const formatDuration = (duration: string): string => {
  // Convert ISO 8601 duration to readable format
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return ''
  
  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const formatViews = (viewCount: number): string => {
  if (viewCount < 1000) return viewCount.toString()
  if (viewCount < 1000000) return `${(viewCount / 1000).toFixed(1)}K`
  return `${(viewCount / 1000000).toFixed(1)}M`
}
</script>

<template>
  <AppCard class="video-item-card">
    <!-- Thumbnail Container -->
    <div class="thumbnail-container">
      <!-- Selection Overlay -->
      <div
        class="selection-overlay"
        v-show="video.selected"
      >
        <div class="selection-checkmark">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- Thumbnail Image -->
      <img
        :src="video.thumbnail"
        :alt="video.title"
        class="thumbnail-image"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Duration Badge (if available) -->
      <div v-if="video.duration" class="duration-badge">
        {{ formatDuration(video.duration) }}
      </div>
    </div>
    
    <!-- Content -->
    <div class="video-content">
      <!-- Title -->
      <h3 class="video-title" :title="video.title">
        {{ video.title }}
      </h3>
      
      <!-- Metadata -->
      <div class="video-metadata">
        <span v-if="video.publishedAt" class="metadata-item">
          {{ formatDate(video.publishedAt) }}
        </span>
        <span v-if="video.viewCount" class="metadata-item">
          {{ formatViews(video.viewCount) }} views
        </span>
      </div>
      
      <!-- Channel Info -->
      <div v-if="video.channelTitle" class="channel-info">
        <span class="channel-name">{{ video.channelTitle }}</span>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
@reference "#main.css";

.video-item-card {
  @apply flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer;
}

.thumbnail-container {
  @apply relative w-full aspect-video bg-gray-200;
}

.selection-overlay {
  @apply absolute inset-0 flex items-center justify-center z-10 rounded-t-lg;
  background-color: rgba(0, 0, 0, 0.5);
}

.selection-checkmark {
  @apply w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center;
}

.thumbnail-image {
  @apply w-full h-full object-cover transition-transform duration-300 hover:scale-110;
}

.duration-badge {
  @apply absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded;
  background-color: rgba(0, 0, 0, 0.8);
}

.video-content {
  @apply flex-1 p-4 flex flex-col gap-2;
}

.video-title {
  @apply font-semibold text-sm lg:text-base text-gray-900 line-clamp-2 leading-tight;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-metadata {
  @apply flex flex-wrap gap-2 text-xs text-gray-500;
}

.metadata-item {
  @apply flex items-center;
}

.metadata-item:not(:last-child)::after {
  content: '•';
  @apply ml-2 text-gray-400;
}

.channel-info {
  @apply mt-auto;
}

.channel-name {
  @apply text-xs text-gray-600 font-medium;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .video-content {
    @apply p-3;
  }
  
  .video-title {
    @apply text-sm;
  }
  
  .video-metadata {
    @apply text-xs;
  }
}

/* Accessibility */
.video-item-card:focus {
  @apply outline-none ring-2 ring-brand-500 ring-offset-2;
}

.video-item-card:focus-visible {
  @apply outline-none ring-2 ring-brand-500 ring-offset-2;
}
</style>
