<script setup lang="ts">
import { ref } from 'vue'
import buttonNav from './buttons/buttonNav.vue'
import siteLogo from './siteLogo.vue'
import BaseButton from "@/components/buttons/BaseButton.vue";

// const search = ref('')
const showMenu = ref(false)

const navLinks = ref([
  {
    link: 'Home',
    path: '/'
  },
  {
    link: 'Reviewers',
    path: '/reviewers'
  },
  {
    link: 'About',
    path: '/about'
  },
  {
    link: 'Contact',
    path: '/contact'
  },
])

const userLinks = ref([
  {
    link: 'Sign Up',
    path: '/signup'
  }
])

</script>

<template>
  <div class="flex flex-row w-full items-center justify-between pt-4 pb-4 pl-8 pr-8">
    <div class="flex flex-row items-center justify-center">
      <site-logo />
    </div>
    <div >
      <div id="menu-button" class="md:hidden">
        <button @click="showMenu=!showMenu"><i class="material-icons">menu</i></button>
      </div>
      <nav id="nav" class="flex flex-row items-center justify-end w-full transition">
        <button-nav v-for="(link, index) in navLinks" :link="link.link" :path="link.path" :key="index"/>
        <span>|</span>
        <button-nav v-for="(link, index) in userLinks" :link="link.link" :path="link.path" :key="index"/>
        <BaseButton>login</BaseButton>
      </nav>
    </div>
  </div>
</template>

<style scoped>

</style>