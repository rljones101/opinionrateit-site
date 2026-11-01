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

// Supported social platforms the user can add. `prefix` is shown as a hint
// and `placeholder` guides the expected value (handle or URL).
interface SocialPlatform {
  id: string
  label: string
  placeholder: string
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'x', label: 'X', placeholder: '@username' },
  { id: 'patreon', label: 'Patreon', placeholder: 'patreon.com/username' },
  { id: 'discord', label: 'Discord', placeholder: 'username or invite link' },
  { id: 'telegram', label: 'Telegram', placeholder: '@username or t.me/username' },
  { id: 'instagram', label: 'Instagram', placeholder: '@username' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@username' },
  { id: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@channel' },
  { id: 'twitch', label: 'Twitch', placeholder: 'twitch.tv/username' }
]

const platformLabel = (id: string) =>
  SOCIAL_PLATFORMS.find((p) => p.id === id)?.label || id

const platformPlaceholder = (id: string) =>
  SOCIAL_PLATFORMS.find((p) => p.id === id)?.placeholder || ''

// Start the existing links from the user's stored map.
const initialSocialLinks = (): Record<string, string> => ({
  ...((props.user as any).socialLinks || {})
})

const formData = reactive({
  name: props.user.name,
  email: props.user.email,
  bio: (props.user as any).bio || '',
  location: (props.user as any).location || '',
  website: (props.user as any).website || '',
  socialLinks: initialSocialLinks() as Record<string, string>
})

// Which platform is currently selected in the "add" dropdown.
const platformToAdd = ref('')

// Platforms not yet added, available to pick from the dropdown.
const availablePlatforms = computed(() =>
  SOCIAL_PLATFORMS.filter((p) => !(p.id in formData.socialLinks))
)

// Ordered list of the links the user has added (for stable rendering).
const addedPlatforms = computed(() =>
  SOCIAL_PLATFORMS.filter((p) => p.id in formData.socialLinks).map((p) => p.id)
)

const addSocialLink = () => {
  if (!platformToAdd.value) return
  if (!(platformToAdd.value in formData.socialLinks)) {
    formData.socialLinks[platformToAdd.value] = ''
  }
  platformToAdd.value = ''
}

const removeSocialLink = (id: string) => {
  delete formData.socialLinks[id]
}

const socialLinksEqual = (a: Record<string, string>, b: Record<string, string>) => {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  return ak.every((k) => a[k] === b[k])
}

const hasChanges = computed(() => {
  return formData.name !== props.user.name || 
         formData.email !== props.user.email ||
         formData.bio !== ((props.user as any).bio || '') ||
         formData.location !== ((props.user as any).location || '') ||
         formData.website !== ((props.user as any).website || '') ||
         !socialLinksEqual(formData.socialLinks, (props.user as any).socialLinks || {})
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
  formData.socialLinks = initialSocialLinks()
  platformToAdd.value = ''

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

    // Drop any social links left blank so we don't persist empty entries.
    const socialLinks: Record<string, string> = {}
    for (const [platform, value] of Object.entries(formData.socialLinks)) {
      const trimmed = value.trim()
      if (trimmed) socialLinks[platform] = trimmed
    }

    // Update user profile via API
    await userStore.updateProfile({
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
      socialLinks
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
        <p class="section-description">
          Add links to the places people can find you. Pick a platform to add it.
        </p>

        <!-- Added links -->
        <div v-if="addedPlatforms.length" class="social-list">
          <div v-for="id in addedPlatforms" :key="id" class="social-row">
            <span class="social-platform">{{ platformLabel(id) }}</span>
            <input
              v-model="formData.socialLinks[id]"
              type="text"
              class="form-input social-input"
              :disabled="!isEditing"
              :class="{ 'input-disabled': !isEditing }"
              :placeholder="platformPlaceholder(id)"
              :aria-label="platformLabel(id)"
            />
            <button
              v-if="isEditing"
              type="button"
              class="social-remove"
              :aria-label="`Remove ${platformLabel(id)}`"
              @click="removeSocialLink(id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <p v-else class="social-empty">No social links added yet.</p>

        <!-- Add control (edit mode only) -->
        <div v-if="isEditing && availablePlatforms.length" class="social-add">
          <select v-model="platformToAdd" class="form-input social-select" aria-label="Choose a platform to add">
            <option value="">Add a platform…</option>
            <option v-for="p in availablePlatforms" :key="p.id" :value="p.id">
              {{ p.label }}
            </option>
          </select>
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="!platformToAdd"
            @click="addSocialLink"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </BaseButton>
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
      <div v-if="!compact" class="danger-zone">
        <div class="danger-text">
          <h3 class="danger-title">Delete account</h3>
          <p class="danger-description">
            This permanently removes your account and data. This action cannot be undone.
          </p>
        </div>

        <BaseButton variant="danger" class="danger-button" @click="handleDeleteAccount">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Account
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-settings {
  @apply bg-secondary-50 rounded-lg shadow-sm border border-app-light-blue;
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
  @apply text-xl font-semibold text-default-50 mb-2;
}

.settings-description {
  @apply text-default-300;
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
  @apply border-b border-app-light-blue pb-8 last:border-b-0 last:pb-0;
}

.section-title {
  @apply text-lg font-medium text-default-50 mb-4;
}

.section-description {
  @apply text-sm text-default-300 mb-4;
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
  @apply block text-sm font-medium text-default-200;
}

.form-input {
  @apply w-full px-3 py-2 border border-app-light-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors;
}

.input-disabled {
  @apply bg-secondary-200 text-default-300 cursor-not-allowed;
}

.social-list {
  @apply space-y-3 mb-4;
}

.social-row {
  @apply flex items-center gap-3;
}

.social-platform {
  @apply w-24 flex-shrink-0 text-sm font-medium text-default-200;
}

.social-input {
  @apply flex-1;
}

.social-remove {
  @apply flex-shrink-0 p-2 rounded-md text-default-300 hover:text-red-400 hover:bg-red-500/10 transition-colors;
}

.social-empty {
  @apply text-sm text-default-300 mb-4;
}

.social-add {
  @apply flex items-center gap-3;
}

.social-select {
  @apply max-w-xs;
}

.settings-actions {
  @apply pt-6 border-t border-app-light-blue;
}

.action-group {
  @apply flex flex-col sm:flex-row gap-3;
}

.danger-zone {
  /* Red-tinted panel that reads on the dark theme (not a bright white box),
     with a single row: text left, action aligned right. */
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4;
  @apply border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-lg;
}

.danger-text {
  @apply min-w-0;
}

.danger-title {
  @apply text-base font-semibold text-red-400;
}

.danger-description {
  @apply text-sm text-red-300/80 mt-0.5;
}

.danger-button {
  @apply flex-shrink-0 self-start sm:self-auto whitespace-nowrap;
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