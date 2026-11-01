<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonNav from './buttons/buttonNav.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useUserStore } from '@/stores/userStore'
import { useLoginDialogStore } from '@/stores/loginDialogStore'
import SiteLogo from '@/components/siteLogo.vue'
import UserAvatar from '@/components/UserAvatar.vue'

interface linkItem {
  label: string
  name: string
  params?: any
}

const router = useRouter()
const userStore = useUserStore()
const loginDialog = useLoginDialogStore()
const showMenu = ref(false)
const showUserMenu = ref(false)

const navLinks: Ref<linkItem[]> = ref([
  {
    label: 'Videos',
    name: 'videos'
  },
  {
    label: 'Reviewers',
    name: 'reviewers'
  },
  {
    label: 'Search',
    name: 'search'
  }
])



const showLogin = () => {
  loginDialog.open()
  closeMenu()
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  showMenu.value = false
  document.body.style.overflow = ''
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  await userStore.logoutUser()
  showUserMenu.value = false
  closeMenu()
  router.push({ name: 'home' })
}

// Close menus when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.user-menu') && showUserMenu.value) {
    showUserMenu.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') showUserMenu.value = false
}

// Close mobile menu on route change
router.afterEach(() => {
  closeMenu()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Mobile Menu Button -->
      <button 
        class="mobile-menu-button md:hidden"
        @click="toggleMenu"
        :aria-expanded="showMenu"
        aria-label="Toggle navigation menu"
      >
        <svg v-if="!showMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <div class="nav-links">
          <ButtonNav
            v-for="(link, index) in navLinks"
            :label="link.label"
            :name="link.name"
            :key="index"
            class="nav-link"
          />
        </div>

        <!-- Auth Actions -->
        <div class="auth-actions">
          <BaseButton 
            v-if="!userStore.isLoggedIn" 
            variant="secondary" 
            @click="showLogin"
            class="login-button"
          >
            Login
          </BaseButton>
          
          <div v-else class="user-menu">
            <button
              type="button"
              class="user-avatar-button"
              :aria-expanded="showUserMenu"
              aria-haspopup="menu"
              :title="userStore.user.name"
              @click="toggleUserMenu"
            >
              <UserAvatar
                :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
                class="w-8 h-8"
              />
            </button>

            <!-- User Dropdown: name + email + logout -->
            <transition name="user-menu-pop">
              <div v-if="showUserMenu" class="user-dropdown" role="menu">
                <div class="user-dropdown-header">
                  <UserAvatar
                    :user="{ name: userStore.user.name, avatarUrl: userStore.user.avatar }"
                    class="w-9 h-9 flex-shrink-0"
                  />
                  <div class="user-dropdown-identity">
                    <span class="user-dropdown-name">{{ userStore.user.name }}</span>
                    <span v-if="userStore.user.email" class="user-dropdown-email">{{ userStore.user.email }}</span>
                  </div>
                </div>
                <BaseButton variant="secondary" class="user-dropdown-logout" @click="logout">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </BaseButton>
              </div>
            </transition>
          </div>
        </div>
      </nav>
    </div>

    <!-- Mobile Navigation Menu -->
    <div class="mobile-nav" :class="{ 'mobile-nav-open': showMenu }">
      <div class="site-logo-container">
          <SiteLogo /> 
        </div>
      <nav class="mobile-nav-content">
        <div class="mobile-nav-links">
          <ButtonNav
            v-for="(link, index) in navLinks"
            :label="link.label"
            :name="link.name"
            :key="index"
            class="mobile-nav-link"
            @click="closeMenu"
          />
        </div>
        
        <div class="mobile-auth-actions">
          <BaseButton 
            v-if="!userStore.isLoggedIn" 
            variant="secondary" 
            @click="showLogin"
            class="mobile-login-button"
          >
            Login
          </BaseButton>
          
          <div v-else class="mobile-user-actions">
            <router-link 
              :to="{ name: 'profile' }" 
              class="mobile-user-link"
              @click="closeMenu"
            >
              Profile
            </router-link>
            <router-link 
              :to="{ name: 'my-profile', params: { name: userStore.user.name } }" 
              class="mobile-user-link"
              @click="closeMenu"
            >
              My Profile (Legacy)
            </router-link>
            <router-link 
              :to="{ name: 'my-stats', params: { name: userStore.user.name } }" 
              class="mobile-user-link"
              @click="closeMenu"
            >
              Statistics
            </router-link>
            <button @click="logout" class="mobile-logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Backdrop for mobile menu -->
    <div 
      v-if="showMenu" 
      class="mobile-backdrop"
      @click="closeMenu"
    ></div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  /* Frosted glass: semi-transparent dark + blur, so content scrolls under it. */
  background-color: rgb(39 50 74 / 0.72); /* secondary-200 @ 72% */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
  box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.4);
  position: relative;
  z-index: 40;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .app-header {
    background-color: var(--color-secondary-200);
  }
}

.header-container {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Mobile header layout */
@media (max-width: 768px) {
  .header-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
  }
  
  .mobile-menu-button {
    grid-column: 1;
  }
  
  .site-logo-container {
    grid-column: 2;
    justify-self: center;
  }
  
  .auth-actions {
    grid-column: 3;
    justify-self: end;
  }
}

.mobile-menu-button {
  padding: 0.5rem;
  color: var(--color-app-text-color);
  border-radius: 0.375rem;
  transition: color 0.2s;
}

.mobile-menu-button:hover {
  color: var(--color-brand-500);
}

.mobile-menu-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-brand-500), 0 0 0 4px rgba(230, 95, 55, 0.1);
}

.desktop-nav {
  display: none;
  align-items: center;
  width: 100%;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

/* Desktop layout: nav-links on left, auth on right, centered spacing */
@media (min-width: 768px) {
  .desktop-nav {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 2rem;
  }
  
  .nav-links {
    justify-self: start;
  }
  
  .auth-actions {
    justify-self: end;
  }
  
  /* .site-logo-container {
    display: none; 
  } */
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-app-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-brand-500);
}

/* .site-logo-container {
  @apply flex-1 flex justify-center;
} */

/* Show logo on mobile only */
@media (max-width: 768px) {
  .site-logo-container {
    @apply block;
  }
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-button {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.user-menu {
  position: relative;
}

.user-avatar-button {
  display: flex;
  align-items: center;
  border-radius: 9999px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.user-avatar-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-brand-500), 0 0 0 4px rgba(230, 95, 55, 0.1);
}

.user-dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 16rem;
  background-color: var(--color-secondary-50);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
  padding: 1rem;
  z-index: 50;
  border: 1px solid var(--color-app-light-blue);
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-app-light-blue);
}

.user-dropdown-identity {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-dropdown-name {
  font-weight: 600;
  color: var(--color-default-50);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-email {
  font-size: 0.875rem;
  color: var(--color-default-300);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-logout {
  width: 100%;
  justify-content: center;
}

/* Popover transition */
.user-menu-pop-enter-active,
.user-menu-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.user-menu-pop-enter-from,
.user-menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 4rem;
  background-color: var(--color-secondary-200);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 30;
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

.mobile-nav-open {
  transform: translateY(0);
}

.mobile-nav-content {
  padding: 1rem;
  max-height: 100vh;
  overflow-y: auto;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-nav-link {
  display: block;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-app-text-color);
  border-radius: 0.375rem;
  text-align: center;
  transition: color 0.2s, background-color 0.2s;
}

.mobile-nav-link:hover {
  color: var(--color-brand-500);
  background-color: var(--color-app-light-blue);
}

.mobile-auth-actions {
  border-top: 1px solid var(--color-app-light-blue);
  padding-top: 1rem;
}

.mobile-login-button {
  width: 100%;
  justify-content: center;
}

.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-user-link {
  display: block;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-app-text-color);
  border-radius: 0.375rem;
  transition: color 0.2s, background-color 0.2s;
}

.mobile-user-link:hover {
  color: var(--color-brand-500);
  background-color: var(--color-app-light-blue);
}

.mobile-logout-button {
  display: block;
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #f87171;
  border-radius: 0.375rem;
  text-align: left;
  transition: background-color 0.2s;
}

.mobile-logout-button:hover {
  background-color: rgba(248, 113, 113, 0.12);
}

.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0 0 0 / 0.5);
  z-index: 20;
}

@media (min-width: 768px) {
  .mobile-backdrop {
    display: none;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .header-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .mobile-nav {
    transition: none;
  }
  
  .mobile-menu-button,
  .user-avatar-button,
  .mobile-nav-link {
    transition: none;
  }
}
</style>
