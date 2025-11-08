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

const twoFactorEnabled = ref(false)
const sessions = ref<LoginSession[]>([])

const securitySettings = reactive({
  loginNotifications: true,
  suspiciousActivityAlerts: true,
  passwordExpiry: false,
  sessionTimeout: 30 // days
})

const loadSecurityData = async () => {
  try {
    isLoading.value = true
    
    // TODO: Load security data from API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    sessions.value = [
      {
        id: '1',
        device: 'Windows PC',
        browser: 'Chrome 118',
        location: 'New York, NY',
        ipAddress: '192.168.1.100',
        lastActive: new Date().toISOString(),
        current: true
      },
      {
        id: '2',
        device: 'iPhone 14',
        browser: 'Safari Mobile',
        location: 'New York, NY',
        ipAddress: '192.168.1.101',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        current: false
      },
      {
        id: '3',
        device: 'MacBook Pro',
        browser: 'Firefox 119',
        location: 'Boston, MA',
        ipAddress: '10.0.0.50',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        current: false
      }
    ]
    
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

const handleToggle2FA = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    
    // TODO: Call API to toggle 2FA
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorEnabled.value = !twoFactorEnabled.value
    
    saveMessage.value = twoFactorEnabled.value 
      ? 'Two-factor authentication enabled!' 
      : 'Two-factor authentication disabled!'
    
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to update two-factor authentication'
  } finally {
    isSaving.value = false
  }
}

const handleRevokeSession = async (sessionId: string) => {
  if (confirm('Are you sure you want to revoke this session? The user will be logged out.')) {
    try {
      // TODO: Call API to revoke session
      await new Promise(resolve => setTimeout(resolve, 500))
      
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      saveMessage.value = 'Session revoked successfully!'
      
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
      
    } catch (error: any) {
      saveError.value = error.message || 'Failed to revoke session'
    }
  }
}

const handleRevokeAllSessions = async () => {
  if (confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device.')) {
    try {
      // TODO: Call API to revoke all sessions except current
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      sessions.value = sessions.value.filter(s => s.current)
      saveMessage.value = 'All other sessions revoked successfully!'
      
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
      
    } catch (error: any) {
      saveError.value = error.message || 'Failed to revoke sessions'
    }
  }
}

const handleSaveSettings = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    
    // TODO: Save security settings to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveMessage.value = 'Security settings saved successfully!'
    
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    saveError.value = error.message || 'Failed to save security settings'
  } finally {
    isSaving.value = false
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
      
      <!-- Two-Factor Authentication -->
      <div class="security-section">
        <h3 class="section-title">Two-Factor Authentication</h3>
        <p class="section-description">
          Add an extra layer of security to your account with two-factor authentication.
        </p>
        
        <div class="two-factor-status">
          <div class="status-indicator">
            <div class="status-icon" :class="twoFactorEnabled ? 'status-enabled' : 'status-disabled'">
              <svg v-if="twoFactorEnabled" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="status-text">
              <span class="status-title">
                {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
              </span>
              <span class="status-description">
                {{ twoFactorEnabled 
                  ? 'Your account is protected with 2FA' 
                  : 'Enable 2FA for better security' 
                }}
              </span>
            </div>
          </div>
          
          <BaseButton 
            :variant="twoFactorEnabled ? 'danger' : 'primary'"
            @click="handleToggle2FA"
            :disabled="isSaving"
          >
            {{ twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
          </BaseButton>
        </div>
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
      
      <!-- Security Settings -->
      <div class="security-section">
        <h3 class="section-title">Security Notifications</h3>
        <p class="section-description">
          Configure how you want to be notified about security events.
        </p>
        
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <input 
                v-model="securitySettings.loginNotifications" 
                type="checkbox" 
                class="setting-checkbox"
              />
              <span class="setting-text">
                <span class="setting-name">Login Notifications</span>
                <span class="setting-desc">Get notified when someone logs into your account</span>
              </span>
            </label>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input 
                v-model="securitySettings.suspiciousActivityAlerts" 
                type="checkbox" 
                class="setting-checkbox"
              />
              <span class="setting-text">
                <span class="setting-name">Suspicious Activity Alerts</span>
                <span class="setting-desc">Get alerts for unusual account activity</span>
              </span>
            </label>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input 
                v-model="securitySettings.passwordExpiry" 
                type="checkbox" 
                class="setting-checkbox"
              />
              <span class="setting-text">
                <span class="setting-name">Password Expiry Reminders</span>
                <span class="setting-desc">Remind me to change my password periodically</span>
              </span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="sessionTimeout" class="form-label">Session Timeout</label>
          <select id="sessionTimeout" v-model="securitySettings.sessionTimeout" class="form-select">
            <option :value="1">1 day</option>
            <option :value="7">7 days</option>
            <option :value="30">30 days</option>
            <option :value="90">90 days</option>
            <option :value="0">Never</option>
          </select>
          <p class="form-hint">How long to keep you logged in when inactive</p>
        </div>
        
        <div class="form-actions">
          <BaseButton 
            variant="primary" 
            :disabled="isSaving"
            @click="handleSaveSettings"
          >
            <LoadingState v-if="isSaving" size="sm" class="mr-2" />
            Save Settings
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-security {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.security-header {
  @apply mb-6;
}

.security-title {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.security-description {
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

.security-content {
  @apply space-y-8;
}

.security-section {
  @apply border-b border-gray-200 pb-8 last:border-b-0 last:pb-0;
}

.section-header {
  @apply flex justify-between items-start mb-6;
}

.section-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.section-description {
  @apply text-gray-600;
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
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
}

.form-hint {
  @apply text-xs text-gray-500;
}

.form-actions {
  @apply flex justify-start;
}

.two-factor-status {
  @apply flex items-center justify-between p-4 bg-gray-50 rounded-lg;
}

.status-indicator {
  @apply flex items-center gap-3;
}

.status-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center;
}

.status-enabled {
  @apply bg-green-100 text-green-600;
}

.status-disabled {
  @apply bg-gray-100 text-gray-400;
}

.status-text {
  @apply flex flex-col;
}

.status-title {
  @apply font-medium text-gray-900;
}

.status-description {
  @apply text-sm text-gray-500;
}

.sessions-list {
  @apply space-y-4;
}

.session-item {
  @apply flex items-start gap-4 p-4 border border-gray-200 rounded-lg;
}

.session-current {
  @apply border-brand-200 bg-brand-50;
}

.session-icon {
  @apply flex-shrink-0 text-gray-400;
}

.session-info {
  @apply flex-1 min-w-0;
}

.session-main {
  @apply flex items-center gap-2 mb-2;
}

.session-device {
  @apply font-medium text-gray-900;
}

.current-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800;
}

.session-details {
  @apply flex flex-wrap gap-2 mb-2;
}

.session-detail {
  @apply text-sm text-gray-500;
}

.session-detail:not(:last-child)::after {
  content: '•';
  @apply ml-2 text-gray-300;
}

.session-meta {
  @apply text-xs text-gray-400;
}

.session-actions {
  @apply flex-shrink-0;
}

.settings-grid {
  @apply space-y-4 mb-6;
}

.setting-item {
  @apply flex items-start;
}

.setting-label {
  @apply flex items-start gap-3 cursor-pointer;
}

.setting-checkbox {
  @apply mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded;
}

.setting-text {
  @apply flex flex-col;
}

.setting-name {
  @apply font-medium text-gray-900;
}

.setting-desc {
  @apply text-sm text-gray-500;
}
</style>