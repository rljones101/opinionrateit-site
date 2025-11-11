<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useUserStore } from '@/stores/userStore'

interface User {
  id: string
  name: string
  email: string
  role: string
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

const userStore = useUserStore()

const isEditing = ref(false)
const isSaving = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const formData = reactive({
  name: props.user.name,
  email: props.user.email,
  bio: (props.user as any).bio || '',
  location: (props.user as any).location || '',
  website: (props.user as any).website || '',
  twitter: (props.user as any).twitter || '',
  linkedin: (props.user as any).linkedin || ''
})

const hasChanges = computed(() => {
  return formData.name !== props.user.name || 
         formData.email !== props.user.email ||
         formData.bio !== ((props.user as any).bio || '') ||
         formData.location !== ((props.user as any).location || '') ||
         formData.website !== ((props.user as any).website || '') ||
         formData.twitter !== ((props.user as any).twitter || '') ||
         formData.linkedin !== ((props.user as any).linkedin || '')
})

const handleEdit = () => {
  isEditing.value = true
  saveMessage.value = ''
  saveError.value = ''
}

const handleCancel = () => {
  // Reset form data
  formData.name = props.user.name
  formData.email = props.user.email
  formData.bio = (props.user as any).bio || ''
  formData.location = (props.user as any).location || ''
  formData.website = (props.user as any).website || ''
  formData.twitter = (props.user as any).twitter || ''
  formData.linkedin = (props.user as any).linkedin || ''
  
  isEditing.value = false
  saveError.value = ''
}

const validateUrl = (url: string): boolean => {
  if (!url) return true // Empty is valid
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

const handleSave = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    
    // Validate URLs
    if (formData.website && !validateUrl(formData.website)) {
      saveError.value = 'Please enter a valid website URL'
      return
    }
    
    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      saveError.value = 'Please enter a valid LinkedIn URL'
      return
    }
    
    // Update user profile via API
    await userStore.updateProfile({
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
      twitter: formData.twitter,
      linkedin: formData.linkedin
    })
    
    saveMessage.value = 'Profile updated successfully!'
    isEditing.value = false
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to update profile'
  } finally {
    isSaving.value = false
  }
}

const handleDeleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await userStore.deleteAccount()
      // User will be logged out and redirected automatically
    } catch (error: any) {
      saveError.value = error.message || 'Failed to delete account'
    }
  }
}
</script>

<template>
  <div class="profile-settings" :class="{ 'compact': compact }">
    <div class="settings-header">
      <h2 class="settings-title">{{ compact ? 'Quick Settings' : 'Profile Settings' }}</h2>
      <p v-if="!compact" class="settings-description">
        Update your personal information and account preferences.
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
    
    <div class="settings-content">
      <!-- Basic Information -->
      <div class="settings-section">
        <h3 class="section-title">Basic Information</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
            />
          </div>
        </div>
      </div>
      
      <!-- Additional Information (only in full view) -->
      <div v-if="!compact" class="settings-section">
        <h3 class="section-title">Additional Information</h3>
        
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label for="bio" class="form-label">Bio</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="3"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="location" class="form-label">Location</label>
            <input
              id="location"
              v-model="formData.location"
              type="text"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              placeholder="City, Country"
            />
          </div>
          
          <div class="form-group">
            <label for="website" class="form-label">Website</label>
            <input
              id="website"
              v-model="formData.website"
              type="url"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
      
      <!-- Social Links (only in full view) -->
      <div v-if="!compact" class="settings-section">
        <h3 class="section-title">Social Links</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="twitter" class="form-label">Twitter</label>
            <input
              id="twitter"
              v-model="formData.twitter"
              type="text"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              placeholder="@username"
            />
          </div>
          
          <div class="form-group">
            <label for="linkedin" class="form-label">LinkedIn</label>
            <input
              id="linkedin"
              v-model="formData.linkedin"
              type="text"
              class="form-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              placeholder="linkedin.com/in/username"
            />
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="settings-actions">
        <div v-if="!isEditing" class="action-group">
          <BaseButton variant="primary" @click="handleEdit">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </BaseButton>
        </div>
        
        <div v-else class="action-group">
          <BaseButton 
            variant="primary" 
            :disabled="!hasChanges || isSaving"
            @click="handleSave"
          >
            <LoadingState v-if="isSaving" size="sm" class="mr-2" />
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </BaseButton>
          
          <BaseButton variant="secondary" @click="handleCancel" :disabled="isSaving">
            Cancel
          </BaseButton>
        </div>
      </div>
      
      <!-- Danger Zone (only in full view) -->
      <div v-if="!compact" class="settings-section danger-zone">
        <h3 class="section-title text-red-600">Danger Zone</h3>
        <p class="section-description text-red-600">
          These actions are irreversible. Please proceed with caution.
        </p>
        
        <div class="danger-actions">
          <BaseButton variant="danger" @click="handleDeleteAccount">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Account
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-settings {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.profile-settings.compact {
  @apply p-4;
}

.profile-settings:not(.compact) {
  @apply p-6;
}

.settings-header {
  @apply mb-6;
}

.settings-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.settings-description {
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

.settings-content {
  @apply space-y-8;
}

.settings-section {
  @apply border-b border-gray-200 pb-8 last:border-b-0 last:pb-0;
}

.section-title {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.section-description {
  @apply text-sm text-gray-600 mb-4;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-group.col-span-2 {
  @apply md:col-span-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors;
}

.input-disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed;
}

.settings-actions {
  @apply pt-6 border-t border-gray-200;
}

.action-group {
  @apply flex flex-col sm:flex-row gap-3;
}

.danger-zone {
  @apply border-red-200 bg-red-50 p-4 rounded-lg;
}

.danger-actions {
  @apply pt-4;
}

/* Compact mode adjustments */
.compact .settings-content {
  @apply space-y-4;
}

.compact .settings-section {
  @apply pb-4;
}

.compact .settings-title {
  @apply text-lg;
}
</style>