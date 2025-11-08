<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon: string
}

interface Props {
  tabs: Tab[]
  activeTab: string
}

interface Emits {
  (e: 'tab-change', tabId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleTabClick = (tabId: string) => {
  emit('tab-change', tabId)
}

const getIconSvg = (icon: string) => {
  const icons: Record<string, string> = {
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    activity: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
  return icons[icon] || icons.user
}
</script>

<template>
  <div class="profile-tabs">
    <div class="tabs-container">
      <nav class="tabs-nav" aria-label="Profile sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'tab-button',
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          ]"
          @click="handleTabClick(tab.id)"
          :aria-selected="activeTab === tab.id"
          role="tab"
        >
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconSvg(tab.icon)" />
          </svg>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.profile-tabs {
  @apply border-b border-gray-200;
}

.tabs-container {
  @apply max-w-full overflow-x-auto;
}

.tabs-nav {
  @apply flex space-x-1 min-w-max;
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap;
  @apply focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2;
}

.tab-active {
  @apply bg-white text-brand-600 border-b-2 border-brand-500 shadow-sm;
}

.tab-inactive {
  @apply text-gray-500 hover:text-gray-700 hover:bg-gray-50;
}

.tab-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.tab-label {
  @apply hidden sm:inline;
}

/* Mobile: Show only icons */
@media (max-width: 640px) {
  .tab-button {
    @apply px-3 py-2;
  }
  
  .tab-label {
    @apply sr-only;
  }
  
  .tab-icon {
    @apply w-6 h-6;
  }
}

/* Tablet: Show icons and labels */
@media (min-width: 641px) {
  .tab-label {
    @apply inline;
  }
}

/* Custom scrollbar for horizontal scroll */
.tabs-container::-webkit-scrollbar {
  height: 4px;
}

.tabs-container::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.tabs-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.tabs-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>