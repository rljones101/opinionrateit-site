<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import buttonNav from './buttons/buttonNav.vue'
import siteLogo from './siteLogo.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useUserStore } from '@/stores/user'
import SearchInput from '@/components/inputs/SearchInput.vue'

interface linkItem {
  label: string
  name: string
  params?: any
}

const router = useRouter()
const userStore = useUserStore()
const showMenu = ref(false)
const navLinks: Ref<linkItem[]> = ref([
  {
    label: 'Home',
    name: 'home'
  },
  {
    label: 'Sign Up',
    name: 'signup'
  }
])

const showLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="w-full flex flex-col relative">
    <div class="w-full p-4 h-20">
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-row items-center justify-center pl-4 pr-4">
          <site-logo v-if="!userStore.isLoggedIn" />
        </div>
        <div class="hidden md:block max-w-4xl w-full ml-4">
          <SearchInput v-if="userStore.isLoggedIn" />
        </div>
        <div class="pl-4">
          <div id="menu-button" class="md:hidden">
            <button @click="showMenu = !showMenu" v-if="!showMenu">
              <i class="material-icons">menu</i>
            </button>
            <button @click="showMenu = !showMenu" v-if="showMenu">
              <i class="material-icons">close</i>
            </button>
          </div>
          <nav id="nav" class="hidden md:flex flex-row items-center justify-end w-full transition">
            <button-nav
              v-for="(link, index) in navLinks"
              :label="link.label"
              :name="link.name"
              :key="index"
            />
            <span v-if="!userStore.isLoggedIn">|</span>
            <BaseButton @click="showLogin" v-if="!userStore.isLoggedIn" class="ml-4"
              >login</BaseButton
            >
          </nav>
        </div>
      </div>
    </div>
    <div class="dropdown-nav-menu" :class="{ show: showMenu }">
      <nav id="hiddenNav" class="flex flex-col bg-app-blue w-full p-8 space-y-6">
        <button-nav
          v-for="(link, index) in navLinks"
          :label="link.label"
          :name="link.name"
          :key="index"
        />
        <BaseButton @click="showLogin" v-if="!userStore.isLoggedIn">login</BaseButton>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.dropdown-nav-menu {
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  z-index: 200;
  transition: opacity 400ms 0ms;
  opacity: 0;
  overflow: hidden;
}

.dropdown-nav-menu.show {
  opacity: 1;
  transition: opacity 1s;
}

.dropdown-nav-menu #hiddenNav {
  max-height: 4rem;
  transition: max-height 1s;
}

.dropdown-nav-menu.show #hiddenNav {
  max-height: 250px;
}
</style>
