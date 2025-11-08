<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

interface User {
  id: string
  name: string
  email: string
}

interface Props {
  user: User
}

defineProps<Props>()

const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const preferences = reactive({
  // Notification preferences
  emailNotifications: true,
  pushNotifications: false,
  reviewNotifications: true,
  videoUpdateNotifications: true,
  weeklyDigest: false,
  
  // Display preferences
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  
  // Privacy preferences
  profileVisibility: 'public',
  showEmail: false,
  showActivity: true,
  allowMessages: true,
  
  // Content preferences
  autoplayVideos: true,
  showMatureContent: false,
  defaultVideoQuality: 'auto',
  subtitlesEnabled: false
})

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto (System)' }
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' }
]

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' }
]

const privacyOptions = [
  { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
  { value: 'members', label: 'Members Only', description: 'Only registered members can view' },
  { value: 'private', label: 'Private', description: 'Only you can view your profile' }
]

const videoQualityOptions = [
  { value: 'auto', label: 'Auto' },
  { value: '1080p', label: '1080p HD' },
  { value: '720p', label: '720p HD' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' }
]

const loadPreferences = async () => {
  try {
    isLoading.value = true
    
    // TODO: Load user preferences from API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock loading preferences - in real app, this would come from API
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to load preferences'
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    
    // TODO: Save preferences to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveMessage.value = 'Preferences saved successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to save preferences'
  } finally {
    isSaving.value = false
  }
}

const handleReset = () => {
  if (confirm('Are you sure you want to reset all preferences to default values?')) {
    // Reset to default values
    Object.assign(preferences, {
      emailNotifications: true,
      pushNotifications: false,
      reviewNotifications: true,
      videoUpdateNotifications: true,
      weeklyDigest: false,
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true,
      allowMessages: true,
      autoplayVideos: true,
      showMatureContent: false,
      defaultVideoQuality: 'auto',
      subtitlesEnabled: false
    })
  }
}

onMounted(() => {
  loadPreferences()
})
</script>

<template>
  <div class="profile-preferences">
    <div class="preferences-header">
      <h2 class="preferences-title">Preferences</h2>
      <p class="preferences-description">
        Customize your experience and control how you interact with the platform.
      </p>
    </div>
    
    <!-- Success Message -->
    <div v-if="saveMessage" class="alert alert-success">
      <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {{ saveMessage }}
    </div>
    
    <!-- Error Message -->
    <div v-if="saveError" class="alert alert-error">
      <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ saveError }}
    </div>
    
    <LoadingState v-if="isLoading" message="Loading your preferences..." />
    
    <div v-else class="preferences-content">
      <!-- Notification Preferences -->
      <div class="preference-section">
        <h3 class="section-title">Notifications</h3>
        <p class="section-description">Choose how you want to be notified about activity.</p>
        
        <div class="preference-grid">
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.emailNotifications" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Email Notifications</span>
                <span class="preference-desc">Receive notifications via email</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.pushNotifications" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Push Notifications</span>
                <span class="preference-desc">Receive browser push notifications</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.reviewNotifications" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Review Updates</span>
                <span class="preference-desc">Notify when someone responds to your reviews</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.videoUpdateNotifications" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Video Updates</span>
                <span class="preference-desc">Notify about new videos from followed channels</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.weeklyDigest" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Weekly Digest</span>
                <span class="preference-desc">Receive a weekly summary of activity</span>
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Display Preferences -->
      <div class="preference-section">
        <h3 class="section-title">Display & Language</h3>
        <p class="section-description">Customize how the interface looks and behaves.</p>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="theme" class="form-label">Theme</label>
            <select id="theme" v-model="preferences.theme" class="form-select">
              <option v-for="option in themeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="language" class="form-label">Language</label>
            <select id="language" v-model="preferences.language" class="form-select">
              <option v-for="option in languageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="timezone" class="form-label">Timezone</label>
            <select id="timezone" v-model="preferences.timezone" class="form-select">
              <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="dateFormat" class="form-label">Date Format</label>
            <select id="dateFormat" v-model="preferences.dateFormat" class="form-select">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Privacy Preferences -->
      <div class="preference-section">
        <h3 class="section-title">Privacy</h3>
        <p class="section-description">Control who can see your information and activity.</p>
        
        <div class="privacy-options">
          <div class="form-group">
            <label class="form-label">Profile Visibility</label>
            <div class="radio-group">
              <label 
                v-for="option in privacyOptions" 
                :key="option.value" 
                class="radio-option"
              >
                <input 
                  v-model="preferences.profileVisibility" 
                  type="radio" 
                  :value="option.value"
                  class="radio-input"
                />
                <span class="radio-content">
                  <span class="radio-title">{{ option.label }}</span>
                  <span class="radio-description">{{ option.description }}</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="preference-grid">
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.showEmail" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Show Email</span>
                <span class="preference-desc">Display email address on your profile</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.showActivity" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Show Activity</span>
                <span class="preference-desc">Display your recent activity publicly</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.allowMessages" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Allow Messages</span>
                <span class="preference-desc">Let other users send you messages</span>
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Content Preferences -->
      <div class="preference-section">
        <h3 class="section-title">Content & Playback</h3>
        <p class="section-description">Customize how videos and content are displayed.</p>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="videoQuality" class="form-label">Default Video Quality</label>
            <select id="videoQuality" v-model="preferences.defaultVideoQuality" class="form-select">
              <option v-for="option in videoQualityOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="preference-grid">
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.autoplayVideos" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Autoplay Videos</span>
                <span class="preference-desc">Automatically play videos when loaded</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.subtitlesEnabled" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Enable Subtitles</span>
                <span class="preference-desc">Show subtitles by default when available</span>
              </span>
            </label>
          </div>
          
          <div class="preference-item">
            <label class="preference-label">
              <input 
                v-model="preferences.showMatureContent" 
                type="checkbox" 
                class="preference-checkbox"
              />
              <span class="preference-text">
                <span class="preference-name">Show Mature Content</span>
                <span class="preference-desc">Display content marked as mature (18+)</span>
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="preferences-actions">
        <div class="action-group">
          <BaseButton 
            variant="primary" 
            :disabled="isSaving"
            @click="handleSave"
          >
            <LoadingState v-if="isSaving" size="sm" class="mr-2" />
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Saving...' : 'Save Preferences' }}
          </BaseButton>
          
          <BaseButton variant="secondary" @click="handleReset" :disabled="isSaving">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Defaults
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-preferences {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.preferences-header {
  @apply mb-6;
}

.preferences-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.preferences-description {
  @apply text-gray-600;
}

.alert {
  @apply flex items-center gap-3 p-4 rounded-lg mb-6;
}

.alert-success {
  @apply bg-green-50 text-green-800 border border-green-200;
}

.alert-error {
  @apply bg-red-50 text-red-800 border border-red-200;
}

.alert-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.preferences-content {
  @apply space-y-8;
}

.preference-section {
  @apply border-b border-gray-200 pb-8 last:border-b-0 last:pb-0;
}

.section-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.section-description {
  @apply text-gray-600 mb-6;
}

.preference-grid {
  @apply space-y-4;
}

.preference-item {
  @apply flex items-start;
}

.preference-label {
  @apply flex items-start gap-3 cursor-pointer;
}

.preference-checkbox {
  @apply mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded;
}

.preference-text {
  @apply flex flex-col;
}

.preference-name {
  @apply font-medium text-gray-900;
}

.preference-desc {
  @apply text-sm text-gray-500;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-6;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.privacy-options {
  @apply mb-6;
}

.radio-group {
  @apply space-y-3;
}

.radio-option {
  @apply flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors;
}

.radio-input {
  @apply mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300;
}

.radio-content {
  @apply flex flex-col;
}

.radio-title {
  @apply font-medium text-gray-900;
}

.radio-description {
  @apply text-sm text-gray-500;
}

.preferences-actions {
  @apply pt-6 border-t border-gray-200;
}

.action-group {
  @apply flex flex-col sm:flex-row gap-3;
}
</style>