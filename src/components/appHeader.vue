<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonNav from './buttons/buttonNav.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useUserStore } from '@/stores/userStore'
import SiteLogo from '@/components/siteLogo.vue'

interface linkItem {
  label: string
  name: string
  params?: any
}

const router = useRouter()
const userStore = useUserStore()
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
  router.push({ name: 'login' })
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

// Close mobile menu on route change
router.afterEach(() => {
  closeMenu()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
            type="secondary" 
            @click="showLogin"
            class="login-button"
          >
            Login
          </BaseButton>
          
          <div v-else class="user-menu">
            <button 
              @click="toggleUserMenu"
              class="user-menu-button"
              :aria-expanded="showUserMenu"
            >
              <span class="user-name">{{ userStore.user.name }}</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- User Dropdown -->
            <div v-if="showUserMenu" class="user-dropdown">
              <router-link :to="{ name: 'my-profile', params: { name: userStore.user.name } }" class="dropdown-item">
                Profile
              </router-link>
              <router-link :to="{ name: 'my-stats', params: { name: userStore.user.name } }" class="dropdown-item">
                Statistics
              </router-link>
              <button @click="logout" class="dropdown-item logout-item">
                Logout
              </button>
            </div>
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
            type="secondary" 
            @click="showLogin"
            class="mobile-login-button"
          >
            Login
          </BaseButton>
          
          <div v-else class="mobile-user-actions">
            <router-link 
              :to="{ name: 'my-profile', params: { name: userStore.user.name } }" 
              class="mobile-user-link"
              @click="closeMenu"
            >
              Profile
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
  @apply w-full bg-secondary-200 shadow-md relative z-40;
}

.header-container {
  @apply max-w-7xl mx-auto px-4 py-3;
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
  @apply p-2 text-gray-700 hover:text-brand-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-md;
}

.desktop-nav {
  @apply hidden md:flex items-center w-full;
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
  @apply flex items-center space-x-1;
}

.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-500 transition-colors duration-200 flex items-center justify-center text-center;
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
  @apply flex items-center space-x-4;
}

.login-button {
  @apply px-4 py-2 text-sm font-medium;
}

.user-menu {
  @apply relative;
}

.user-menu-button {
  @apply flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-md;
}

.user-name {
  @apply max-w-xs truncate;
}

.user-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200;
}

.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full text-left;
}

.logout-item {
  @apply border-t border-gray-200 text-red-600 hover:bg-red-50;
}

/* Mobile Navigation */
.mobile-nav {
  @apply md:hidden fixed inset-x-0 top-16 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30;
  transform: translateY(-100%);
}

.mobile-nav-open {
  transform: translateY(0);
}

.mobile-nav-content {
  @apply p-4 max-h-screen overflow-y-auto;
}

.mobile-nav-links {
  @apply space-y-2 mb-6;
}

.mobile-nav-link {
  @apply block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50 rounded-md transition-colors duration-200 text-center;
}

.mobile-auth-actions {
  @apply border-t border-gray-200 pt-4;
}

.mobile-login-button {
  @apply w-full justify-center;
}

.mobile-user-actions {
  @apply space-y-2;
}

.mobile-user-link {
  @apply block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50 rounded-md transition-colors duration-200;
}

.mobile-logout-button {
  @apply block w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 text-left;
}

.mobile-backdrop {
  @apply md:hidden fixed inset-0 bg-black bg-opacity-50 z-20;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .header-container {
    @apply px-2 py-2;
  }
  
  .user-name {
    @apply max-w-sm;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .mobile-nav {
    @apply transition-none;
  }
  
  .mobile-menu-button,
  .user-menu-button,
  .dropdown-item,
  .mobile-nav-link {
    @apply transition-none;
  }
}
</style>
