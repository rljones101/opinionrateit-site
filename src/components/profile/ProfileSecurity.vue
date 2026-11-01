<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { formatDate } from '@/utils/DateUtils'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

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

interface LoginSession {
  id: string
  device: string
  browser: string
  location: string
  ipAddress: string
  lastActive: string
  current: boolean
}

interface Props {
  user: User
}

defineProps<Props>()

const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const sessions = ref<LoginSession[]>([])

const API_URL = import.meta.env.VITE_API_URL

const loadSecurityData = async () => {
  try {
    isLoading.value = true
    saveError.value = ''

    const response = await fetch(`${API_URL}/api/v1/users/me/sessions`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to load active sessions')
    }

    const data = await response.json()
    if (data.status === 'success') {
      sessions.value = data.data.sessions
    } else {
      throw new Error(data.message || 'Failed to load active sessions')
    }
  } catch (error: any) {
    saveError.value = error.message || 'Failed to load security data'
  } finally {
    isLoading.value = false
  }
}

const handlePasswordChange = async () => {
  try {
    // Validate form
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      saveError.value = 'Please fill in all password fields'
      return
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      saveError.value = 'New passwords do not match'
      return
    }
    
    if (passwordForm.newPassword.length < 8) {
      saveError.value = 'New password must be at least 8 characters long'
      return
    }
    
    isSaving.value = true
    saveError.value = ''
    
    // Call API to change password
    await userStore.changePassword({
      passwordCurrent: passwordForm.currentPassword,
      password: passwordForm.newPassword,
      passwordConfirm: passwordForm.confirmPassword
    })
    
    // Clear form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    saveMessage.value = 'Password changed successfully!'
    
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to change password'
  } finally {
    isSaving.value = false
  }
}

const handleRevokeSession = async (sessionId: string) => {
  if (!confirm('Revoke this session? That device will be signed out.')) return

  try {
    saveError.value = ''
    const response = await fetch(`${API_URL}/api/v1/users/me/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to revoke session')
    }

    sessions.value = sessions.value.filter((s) => s.id !== sessionId)
    saveMessage.value = 'Session revoked successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error: any) {
    saveError.value = error.message || 'Failed to revoke session'
  }
}

const handleRevokeAllSessions = async () => {
  if (
    !confirm(
      'Revoke all other sessions? You will stay signed in on this device, and all other devices will be signed out.'
    )
  )
    return

  try {
    saveError.value = ''
    const response = await fetch(`${API_URL}/api/v1/users/me/sessions`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to revoke sessions')
    }

    // Keep only the current session locally.
    sessions.value = sessions.value.filter((s) => s.current)
    saveMessage.value = 'All other sessions revoked successfully!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error: any) {
    saveError.value = error.message || 'Failed to revoke sessions'
  }
}

onMounted(() => {
  loadSecurityData()
})
</script>

<template>
  <div class="profile-security">
    <div class="security-header">
      <h2 class="security-title">Security</h2>
      <p class="security-description">
        Manage your account security settings and monitor login activity.
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
    
    <LoadingState v-if="isLoading" message="Loading security settings..." />
    
    <div v-else class="security-content">
      <!-- Password Change -->
      <div class="security-section">
        <h3 class="section-title">Change Password</h3>
        <p class="section-description">
          Update your password to keep your account secure.
        </p>
        
        <form @submit.prevent="handlePasswordChange" class="password-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="currentPassword" class="form-label">Current Password</label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="newPassword" class="form-label">New Password</label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                class="form-input"
                minlength="8"
                required
              />
              <p class="form-hint">Must be at least 8 characters long</p>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="form-actions">
            <BaseButton 
              type="submit" 
              variant="primary" 
              :disabled="isSaving"
            >
              <LoadingState v-if="isSaving" size="sm" class="mr-2" />
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ isSaving ? 'Changing...' : 'Change Password' }}
            </BaseButton>
          </div>
        </form>
      </div>
      
      <!-- Active Sessions -->
      <div class="security-section">
        <div class="section-header">
          <div>
            <h3 class="section-title">Active Sessions</h3>
            <p class="section-description">
              Monitor and manage your active login sessions across devices.
            </p>
          </div>
          
          <BaseButton 
            variant="secondary" 
            size="sm"
            @click="handleRevokeAllSessions"
          >
            Revoke All Others
          </BaseButton>
        </div>
        
        <div class="sessions-list">
          <div 
            v-for="session in sessions" 
            :key="session.id"
            class="session-item"
            :class="{ 'session-current': session.current }"
          >
            <div class="session-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div class="session-info">
              <div class="session-main">
                <h4 class="session-device">{{ session.device }}</h4>
                <span v-if="session.current" class="current-badge">Current Session</span>
              </div>
              
              <div class="session-details">
                <span class="session-detail">{{ session.browser }}</span>
                <span class="session-detail">{{ session.location }}</span>
                <span class="session-detail">{{ session.ipAddress }}</span>
              </div>
              
              <div class="session-meta">
                <span class="session-time">Last active: {{ formatDate(session.lastActive) }}</span>
              </div>
            </div>
            
            <div class="session-actions">
              <BaseButton 
                v-if="!session.current"
                variant="danger" 
                size="sm"
                @click="handleRevokeSession(session.id)"
              >
                Revoke
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-security {
  @apply bg-secondary-50 rounded-lg shadow-sm border border-app-light-blue p-6;
}

.security-header {
  @apply mb-6;
}

.security-title {
  @apply text-xl font-semibold text-default-50 mb-2;
}

.security-description {
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

.security-content {
  @apply space-y-8;
}

.security-section {
  @apply border-b border-app-light-blue pb-8 last:border-b-0 last:pb-0;
}

.section-header {
  @apply flex justify-between items-start mb-6;
}

.section-title {
  @apply text-lg font-medium text-default-50 mb-2;
}

.section-description {
  @apply text-default-300;
}

.password-form {
  @apply space-y-6;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-default-200;
}

.form-input {
  @apply w-full px-3 py-2 border border-app-light-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.form-select {
  @apply w-full px-3 py-2 border border-app-light-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.form-hint {
  @apply text-xs text-default-300;
}

.form-actions {
  @apply flex justify-start;
}

.sessions-list {
  @apply space-y-4;
}

.session-item {
  @apply flex items-start gap-4 p-4 border border-app-light-blue rounded-lg;
}

.session-current {
  /* Subtle brand-tinted highlight that reads on the dark theme (not a pale
     light-theme panel). */
  @apply border-brand-500/40 bg-brand-500/10;
}

.session-icon {
  @apply flex-shrink-0 text-default-400;
}

.session-info {
  @apply flex-1 min-w-0;
}

.session-main {
  @apply flex items-center gap-2 mb-2;
}

.session-device {
  @apply font-medium text-default-50;
}

.current-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-500 text-white;
}

.session-details {
  @apply flex flex-wrap gap-2 mb-2;
}

.session-detail {
  @apply text-sm text-default-300;
}

.session-detail:not(:last-child)::after {
  content: '•';
  @apply ml-2 text-default-400;
}

.session-meta {
  @apply text-xs text-default-400;
}

.session-actions {
  @apply flex-shrink-0;
}
</style>