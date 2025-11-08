<script setup lang="ts">
import { ref, computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { formatDate } from '@/utils/DateUtils'

interface User {
  id: string
  name: string
  email: string
  role: string
  photo?: string
  createdAt: string
  lastLoginAt?: string
}

interface Props {
  user: User
}

const props = defineProps<Props>()

const isEditingAvatar = ref(false)
const avatarUploadRef = ref<HTMLInputElement | null>(null)

const roleDisplayName = computed(() => {
  const roleMap: Record<string, string> = {
    'user': 'Member',
    'reviewer-basic': 'Basic Reviewer',
    'reviewer-plus': 'Plus Reviewer',
    'admin': 'Administrator'
  }
  return roleMap[props.user.role] || props.user.role
})

const roleColor = computed(() => {
  const colorMap: Record<string, string> = {
    'user': 'bg-blue-100 text-blue-800',
    'reviewer-basic': 'bg-green-100 text-green-800',
    'reviewer-plus': 'bg-purple-100 text-purple-800',
    'admin': 'bg-red-100 text-red-800'
  }
  return colorMap[props.user.role] || 'bg-gray-100 text-gray-800'
})

const memberSince = computed(() => {
  return formatDate(props.user.createdAt)
})

const lastSeen = computed(() => {
  return props.user.lastLoginAt ? formatDate(props.user.lastLoginAt) : 'Never'
})

const handleAvatarClick = () => {
  isEditingAvatar.value = true
  avatarUploadRef.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // TODO: Implement avatar upload functionality
    console.log('Avatar upload:', file)
    // This would typically upload to S3 or similar service
  }
  
  isEditingAvatar.value = false
}

const handleEditProfile = () => {
  // TODO: Open edit profile modal or navigate to edit page
  console.log('Edit profile clicked')
}
</script>

<template>
  <div class="profile-header">
    <div class="header-background">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-90"></div>
      <div class="absolute inset-0 bg-black opacity-20"></div>
    </div>
    
    <div class="header-content">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-container" @click="handleAvatarClick">
          <UserAvatar 
            :user="user" 
            size="xl" 
            class="avatar-image"
          />
          <div class="avatar-overlay">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        <input 
          ref="avatarUploadRef"
          type="file" 
          accept="image/*" 
          class="hidden" 
          @change="handleAvatarUpload"
        />
      </div>
      
      <!-- User Info -->
      <div class="user-info">
        <h1 class="user-name">{{ user.name }}</h1>
        <p class="user-email">{{ user.email }}</p>
        
        <div class="user-meta">
          <span class="role-badge" :class="roleColor">
            {{ roleDisplayName }}
          </span>
          
          <div class="meta-items">
            <div class="meta-item">
              <span class="meta-label">Member since:</span>
              <span class="meta-value">{{ memberSince }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last seen:</span>
              <span class="meta-value">{{ lastSeen }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="header-actions">
        <BaseButton 
          variant="secondary" 
          size="sm"
          @click="handleEditProfile"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-header {
  @apply relative rounded-lg overflow-hidden mb-6;
  min-height: 200px;
}

.header-background {
  @apply absolute inset-0;
}

.header-content {
  @apply relative z-10 p-6 flex flex-col md:flex-row items-start md:items-end gap-6;
}

.avatar-section {
  @apply flex-shrink-0;
}

.avatar-container {
  @apply relative cursor-pointer group;
}

.avatar-image {
  @apply ring-4 ring-white shadow-lg;
}

.avatar-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200;
}

.user-info {
  @apply flex-1 text-white;
}

.user-name {
  @apply text-3xl font-bold mb-1;
}

.user-email {
  @apply text-lg opacity-90 mb-4;
}

.user-meta {
  @apply space-y-3;
}

.role-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.meta-items {
  @apply flex flex-col sm:flex-row gap-4;
}

.meta-item {
  @apply flex flex-col sm:flex-row sm:items-center gap-1;
}

.meta-label {
  @apply text-sm opacity-75;
}

.meta-value {
  @apply font-medium;
}

.header-actions {
  @apply flex-shrink-0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .header-content {
    @apply flex-col items-center text-center;
  }
  
  .user-name {
    @apply text-2xl;
  }
  
  .meta-items {
    @apply flex-col;
  }
}
</style>