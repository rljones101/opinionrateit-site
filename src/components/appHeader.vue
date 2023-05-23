<script setup lang="ts">
import { ref } from 'vue'
import buttonNav from './buttons/buttonNav.vue'
import siteLogo from './siteLogo.vue'

const search = ref('')
const showMenu = ref(false)

const navLinks = ref([
  {
    link: 'Reviewers',
    path: '/reviewers'
  },
  {
    link: 'Join',
    path: '/signup'
  }
])

</script>

<template>
  <div class="app-header flex flex-row w-full justify-between">
    <div class="flex flex-row items-center justify-center">
      <site-logo />
    </div>
    <div class="main-nav-container rounded-2xl p-4">
      <div id="menu-button" class="md:hidden" @click="showMenu">
        <button @click="showMenu=!showMenu"><i class="material-icons">menu</i></button>
      </div>
      <nav id="nav" class="flex flex-row items-center justify-end w-full transition">
        <button-nav v-for="(link, index) in navLinks" :link="link.link" :path="link.path" :key="index"/>
        <button class="bg-orange-500 pl-4 pr-4 pt-2 pb-2">LOGIN</button>
      </nav>
    </div>
  </div>
</template>

<style scoped>

</style>