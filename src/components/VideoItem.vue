<script setup lang="ts">
import { computed } from 'vue'
import type { Video } from '@/types'
import AppCard from '@/components/cards/AppCard.vue'
import BookmarkButton from '@/components/bookmarks/BookmarkButton.vue'

const props = defineProps<{
  video: Video
}>()

const scores = computed(() => props.video.scores ?? null)
const hasScores = computed(() => !!scores.value && scores.value.reviewCount > 0)

// Color the overall score ring by value: green (good) → amber (mid) → red (poor).
const scoreColor = computed(() => {
  const m = scores.value?.metric ?? 0
  if (m >= 75) return 'var(--color-accent-green)'
  if (m >= 50) return '#f59e0b'
  return 'var(--color-red-500)'
})

// SVG ring geometry (circumference for r=18).
const RING_CIRCUMFERENCE = 2 * Math.PI * 18
const ringOffset = computed(() => {
  const pct = Math.max(0, Math.min(100, scores.value?.metric ?? 0)) / 100
  return RING_CIRCUMFERENCE * (1 - pct)
})

const reviewCountLabel = computed(() => {
  const n = scores.value?.reviewCount ?? 0
  return `Rated by ${n} reviewer${n === 1 ? '' : 's'}`
})

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

      <!-- Overall community score ring (top-left) -->
      <div class="score-ring" :title="hasScores ? `Overall review score: ${scores!.metric}` : 'Not yet rated'">
        <svg viewBox="0 0 44 44" class="score-ring-svg">
          <circle cx="22" cy="22" r="18" class="score-ring-track" />
          <circle
            v-if="hasScores"
            cx="22" cy="22" r="18"
            class="score-ring-value"
            :stroke="scoreColor"
            :stroke-dasharray="RING_CIRCUMFERENCE"
            :stroke-dashoffset="ringOffset"
          />
          <circle v-else cx="22" cy="22" r="18" class="score-ring-track score-ring-empty" />
        </svg>
        <span class="score-ring-label">{{ hasScores ? scores!.metric : '—' }}</span>
      </div>

      <!-- Duration Badge (if available) -->
      <div v-if="video.duration" class="duration-badge">
        {{ formatDuration(video.duration) }}
      </div>
      
      <!-- Bookmark Button -->
      <div v-if="video.id || video.videoId" class="bookmark-button-container">
        <BookmarkButton :video-id="video.id || video.videoId" size="sm" />
      </div>
    </div>
    
    <!-- Content -->
    <div class="video-content">
      <!-- Title -->
      <h3 class="video-title" :title="video.title">
        {{ video.title }}
      </h3>

      <!-- Channel -->
      <div v-if="video.channelTitle" class="channel-info">
        <span class="channel-name">{{ video.channelTitle }}</span>
      </div>

      <!-- Honesty signals (the differentiator) -->
      <div v-if="hasScores" class="quality-signals">
        <!-- Non-bias badge: the product's core promise -->
        <span class="unbiased-badge" title="Community non-bias score">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          </svg>
          Unbiased {{ scores!.non_bias }}
        </span>
        <!-- One supporting quality chip -->
        <span class="quality-chip" title="Community clarity score">
          Clarity {{ scores!.clarity }}
        </span>
      </div>

      <!-- Not-yet-rated state doubles as a signup nudge -->
      <div v-else class="not-rated">
        Not yet rated — <span class="not-rated-cta">be the first to review</span>
      </div>

      <!-- Community count + secondary metadata -->
      <div class="video-footer">
        <span v-if="hasScores" class="review-count">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-3-6.65" />
          </svg>
          {{ reviewCountLabel }}
        </span>
        <span class="video-meta-secondary">
          <template v-if="video.viewCount">{{ formatViews(video.viewCount) }} views</template>
          <template v-if="video.viewCount && video.publishedAt"> · </template>
          <template v-if="video.publishedAt">{{ formatDate(video.publishedAt) }}</template>
        </span>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
@reference "#main.css";

.video-item-card {
  @apply flex flex-col h-full rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer;
  /* Frosted glass surface (raw CSS so it overrides AppCard's solid bg). */
  background-color: rgb(26 34 52 / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.06);
}

/* Brand-coloured edge on hover reads better than a shadow swell alone on dark. */
.video-item-card:hover {
  border-color: var(--color-brand-500);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .video-item-card {
    background-color: var(--color-secondary-50);
  }
}

.thumbnail-container {
  @apply relative w-full aspect-video bg-secondary-200;
}

.selection-overlay {
  @apply absolute inset-0 flex items-center justify-center z-10 rounded-t-lg bg-black/50;
}

.selection-checkmark {
  @apply w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center;
}

.thumbnail-image {
  @apply w-full h-full object-cover transition-transform duration-300 hover:scale-110;
}

.duration-badge {
  @apply absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded bg-black/80;
}

/* --- Overall score ring (top-left over the thumbnail) --- */
.score-ring {
  @apply absolute top-2 left-2 z-20 flex items-center justify-center;
  width: 44px;
  height: 44px;
}

.score-ring-svg {
  @apply absolute inset-0 w-full h-full;
}

.score-ring::before {
  content: '';
  @apply absolute rounded-full;
  inset: 3px;
  background-color: rgb(14 20 32 / 0.85);
}

.score-ring-track {
  fill: none;
  stroke: var(--color-secondary-200);
  stroke-width: 4;
}

.score-ring-empty {
  stroke-dasharray: 4 4;
  stroke: var(--color-default-600);
}

.score-ring-value {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.6s ease;
}

.score-ring-label {
  @apply relative z-10 text-sm font-extrabold text-default-50;
}

.bookmark-button-container {
  @apply absolute top-2 right-2 z-20;
  @apply opacity-0 transition-opacity duration-200;
}

.thumbnail-container:hover .bookmark-button-container {
  @apply opacity-100;
}

.video-content {
  @apply flex-1 p-4 flex flex-col gap-2;
}

.video-title {
  @apply font-semibold text-sm lg:text-base text-default-50 line-clamp-2 leading-tight;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.channel-info {
  @apply -mt-1;
}

.channel-name {
  @apply text-xs text-default-300 font-medium;
}

/* --- Honesty signals --- */
.quality-signals {
  @apply flex flex-wrap items-center gap-2 mt-1;
}

.unbiased-badge {
  @apply inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full;
  @apply text-brand-300 border border-brand-500/50;
  background-color: rgb(249 116 21 / 0.12);
}

.quality-chip {
  @apply inline-flex items-center text-xs px-2 py-1 rounded-full text-default-200 bg-secondary-200;
}

.not-rated {
  @apply mt-1 text-xs text-default-300 px-2 py-1.5 rounded-md bg-secondary-200 border border-app-light-blue;
}

.not-rated-cta {
  @apply text-brand-400 font-semibold;
}

/* --- Footer: community count + secondary meta --- */
.video-footer {
  @apply mt-auto pt-2 flex flex-col gap-0.5;
}

.review-count {
  @apply inline-flex items-center gap-1 text-xs text-default-300 font-medium;
}

.video-meta-secondary {
  @apply text-[11px] text-default-400;
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
