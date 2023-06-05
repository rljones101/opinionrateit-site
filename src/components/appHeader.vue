<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import buttonNav from './buttons/buttonNav.vue'
import siteLogo from './siteLogo.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { useUserStore } from '@/stores/user'
import UserLogin from '@/components/forms/UserLogin.vue'
import { useDialog } from '@/controllers/dialogController'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { show } = useDialog('#UserLoginDialog')

const emit = defineEmits(['userLogin', 'userSignup', 'userProfile'])
const showMenu = ref(false)
const navLinks = ref([])
const userLinks = ref([])

// 1) check if user is logged in
if (userStore.isLoggedIn) {
  // 2) Check if the current route is NOT the profile route
  if (route.name !== 'reviewers') {
    // 3) Go to the profile route
    router.push({ name: 'reviewers' })
  }
}

const setDefaultLinks = (isLoggedIn = false) => {
  let links = [
    {
      link: 'Home',
      path: '/'
    }
    // {
    //   link: 'About',
    //   path: '/about'
    // },
    // {
    //   link: 'Contact',
    //   path: '/contact'
    // }
  ]

  if (isLoggedIn) {
    links = [
      {
        link: 'Reviewers',
        path: '/reviewers'
      }
    ]
  }

  return links
}

const setUserLinks = (userName?: string) => {
  let links = [
    {
      link: 'Sign Up',
      path: '/signup',
      command: () => {
        emit('userSignup')
      }
    }
  ]

  if (userName !== '') {
    links = [{ link: 'Profile', path: `/profile/${userName}`, command: null }]
  }

  return links
}

const logout = () => {
  userStore.logoutUser()
  router.push({ name: 'home' })
}

watch(
  () => userStore.isLoggedIn,
  (isTruthy) => {
    navLinks.value = setDefaultLinks(isTruthy)
    const userName = isTruthy ? userStore.user.name : ''
    userLinks.value = setUserLinks(userName)
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-col w-full items-center justify-between pt-4 pb-4 pl-8 pr-8 transition">
    <UserLogin />
    <div class="flex items-center w-full max-w-7xl mx-auto">
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-row items-center justify-center">
          <site-logo />
        </div>
        <div>
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
              :link="link.link"
              :path="link.path"
              :key="index"
            />
            <span v-if="!userStore.isLoggedIn">|</span>
            <button-nav
              v-for="(link, index) in userLinks"
              :link="link.link"
              :path="link.path"
              :key="index"
            />
            <BaseButton @click="show" v-if="!userStore.isLoggedIn">login</BaseButton>
            <BaseButton v-if="userStore.isLoggedIn" @click="logout">logout</BaseButton>
          </nav>
        </div>
      </div>
    </div>
    <div class="dropdown-nav-menu" :class="{ show: showMenu }">
      <nav id="hiddenNav" class="flex flex-col items-start">
        <button-nav
          v-for="(link, index) in navLinks"
          :link="link.link"
          :path="link.path"
          :key="index"
        />
        <span class="hidden md:inline">|</span>
        <button-nav
          v-for="(link, index) in userLinks"
          :link="link.link"
          :path="link.path"
          :key="index"
        />
        <BaseButton @click="show" v-if="!userStore.isLoggedIn">login</BaseButton>
        <BaseButton v-if="userStore.isLoggedIn" @click="logout">logout</BaseButton>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.dropdown-nav-menu {
  transition: height 0ms 400ms, opacity 400ms 0ms;
  height: 0;
  opacity: 0;
  overflow: hidden;
}
.dropdown-nav-menu.show {
  opacity: 1;
  height: auto;
  transition: height 0ms 0ms, opacity 600ms 0ms;
}
</style>
