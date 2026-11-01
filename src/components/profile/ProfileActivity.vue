<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import LoadingState from '@/components/ui/LoadingState.vue'
import { formatDate, timeAgo } from '@/utils/DateUtils'
import { useActivityStore } from '@/stores/activityStore'

interface User {
  id: string
  name: string
  email: string
  role?: string
  photo?: string
  avatar?: string
  createdAt?: string
  lastLoginAt?: string
}

interface Props {
  user: User
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const activityStore = useActivityStore()
const { activities, stats, loading: isLoading, error } = storeToRefs(activityStore)

const displayLimit = computed(() => props.compact ? 5 : 20)

// Derive the display stats from the store. The store supplies the
// user-scoped counts; last-active is computed from the most recent item.
const activityStats = computed(() => {
  const lastActivity = activities.value.length
    ? activities.value.reduce((latest, a) =>
        new Date(a.timestamp) > new Date(latest) ? a.timestamp : latest,
      activities.value[0].timestamp)
    : null

  return {
    totalReviews: stats.value.totalReviews,
    totalVideoViews: stats.value.totalVideoViews,
    thisWeekActivity: stats.value.thisWeekActivity,
    lastActivity
  }
})

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    review: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    video_view: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    profile_update: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    login: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    signup: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
  }
  return icons[type] || icons.profile_update
}

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    review: 'text-blue-500 bg-blue-100',
    video_view: 'text-green-500 bg-green-100',
    profile_update: 'text-purple-500 bg-purple-100',
    login: 'text-gray-500 bg-gray-100',
    signup: 'text-brand-500 bg-brand-100'
  }
  return colors[type] || colors.profile_update
}

onMounted(() => {
  // Fetch the current user's activity (the endpoint is scoped to the
  // authenticated user server-side, so each user only sees their own).
  activityStore.fetchActivity({ limit: props.compact ? 5 : 20, offset: 0 })
})
</script>

<template>
  <div class="profile-activity" :class="{ 'compact': compact }">
    <div class="activity-header">
      <h2 class="activity-title">{{ compact ? 'Recent Activity' : 'Activity History' }}</h2>
      <p v-if="!compact" class="activity-description">
        Your recent actions and engagement on the platform.
      </p>
    </div>
    
    <LoadingState v-if="isLoading" :message="compact ? 'Loading...' : 'Loading your activity...'" />
    
    <div v-else-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="activity-content">
      <!-- Activity Stats (only in full view) -->
      <div v-if="!compact" class="activity-stats">
        <div class="stat-card">
          <div class="stat-value">{{ activityStats.totalReviews }}</div>
          <div class="stat-label">Reviews</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activityStats.totalVideoViews }}</div>
          <div class="stat-label">Videos Watched</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activityStats.thisWeekActivity }}</div>
          <div class="stat-label">This Week</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activityStats.lastActivity ? timeAgo(activityStats.lastActivity) : 'Never' }}</div>
          <div class="stat-label">Last Active</div>
        </div>
      </div>
      
      <!-- Activity Timeline -->
      <div class="activity-timeline">
        <div v-if="activities.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No activity yet</p>
          <p class="text-sm text-default-300">Start exploring to see your activity here!</p>
        </div>
        
        <div v-else class="timeline-list">
          <div 
            v-for="(activity, index) in activities.slice(0, displayLimit)" 
            :key="activity.id"
            class="timeline-item"
            :class="{ 'timeline-item-last': index === Math.min(activities.length, displayLimit) - 1 }"
          >
            <div class="timeline-marker">
              <div class="timeline-icon" :class="getActivityColor(activity.type)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.type)" />
                </svg>
              </div>
            </div>
            
            <div class="timeline-content">
              <div class="activity-item">
                <div class="activity-main">
                  <h4 class="activity-title-item">{{ activity.title }}</h4>
                  <p class="activity-description">{{ activity.description }}</p>
                </div>
                
                <div class="activity-meta">
                  <span class="activity-time">{{ timeAgo(activity.timestamp) }}</span>
                  <span class="activity-date">{{ formatDate(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Show More Button (only in compact mode) -->
        <div v-if="compact && activities.length > displayLimit" class="show-more">
          <router-link to="/profile?tab=activity" class="show-more-link">
            View all activity
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-activity {
  @apply bg-secondary-50 rounded-lg shadow-sm border border-app-light-blue;
}

.profile-activity.compact {
  @apply p-4;
}

.profile-activity:not(.compact) {
  @apply p-6;
}

.activity-header {
  @apply mb-6;
}

.activity-title {
  @apply text-xl font-semibold text-default-50 mb-2;
}

.activity-description {
  @apply text-default-300;
}

.error-state {
  @apply flex flex-col items-center justify-center py-8 text-default-300;
}

.error-icon {
  @apply w-12 h-12 mb-4;
}

.activity-content {
  @apply space-y-6;
}

.activity-stats {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.stat-card {
  @apply bg-secondary-200 rounded-lg p-4 text-center;
}

.stat-value {
  @apply text-2xl font-bold text-default-50 mb-1;
}

.stat-label {
  @apply text-sm text-default-300;
}

.activity-timeline {
  @apply space-y-4;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-default-300;
}

.empty-icon {
  @apply w-16 h-16 mb-4;
}

.timeline-list {
  @apply space-y-4;
}

.timeline-item {
  @apply relative flex gap-4 pb-4;
}

.timeline-item:not(.timeline-item-last)::after {
  content: '';
  @apply absolute left-6 top-12 w-0.5 h-full bg-secondary-200;
}

.timeline-marker {
  @apply flex-shrink-0;
}

.timeline-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
}

.timeline-content {
  @apply flex-1 min-w-0;
}

.activity-item {
  @apply bg-secondary-200 rounded-lg p-4;
}

.activity-main {
  @apply mb-3;
}

.activity-title-item {
  @apply font-medium text-default-50 mb-1;
}

.activity-description {
  @apply text-default-300 text-sm;
}

.activity-meta {
  @apply flex items-center gap-3 text-xs text-default-300;
}

.activity-time {
  @apply font-medium;
}

.activity-date {
  @apply opacity-75;
}

.show-more {
  @apply pt-4 border-t border-app-light-blue text-center;
}

.show-more-link {
  @apply inline-flex items-center text-brand-600 hover:text-brand-700 font-medium transition-colors;
}

/* Compact mode adjustments */
.compact .activity-title {
  @apply text-lg;
}

.compact .timeline-item {
  @apply pb-3;
}

.compact .timeline-icon {
  @apply w-10 h-10;
}

.compact .activity-item {
  @apply p-3;
}
</style>