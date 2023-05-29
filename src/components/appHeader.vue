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
  <div class="flex flex-col w-full items-center justify-between pt-4 pb-4 pl-8 pr-8 transition">
    <div class="flex justify-between items-center w-full">
      <div class="flex flex-row items-center justify-center">
        <site-logo class="-mt-5" />
      </div>
      <div>
        <div id="menu-button" class="md:hidden">
          <button @click="showMenu=!showMenu" v-if="!showMenu"><i class="material-icons">menu</i></button>
          <button @click="showMenu=!showMenu" v-if="showMenu"><i class="material-icons">close</i></button>
        </div>
        <nav id="nav" class="hidden md:flex flex-row items-center justify-end w-full transition" >
          <button-nav v-for="(link, index) in navLinks" :link="link.link" :path="link.path" :key="index"/>
          <span>|</span>
          <button-nav v-for="(link, index) in userLinks" :link="link.link" :path="link.path" :key="index"/>
          <BaseButton>login</BaseButton>
        </nav>
      </div>
    </div>

    <div class="dropdown-nav-menu" :class="{'show': showMenu}">
      <nav id="hiddenNav" class="flex flex-col items-start">
        <button-nav v-for="(link, index) in navLinks" :link="link.link" :path="link.path" :key="index"/>
        <span class="hidden md:inline">|</span>
        <button-nav v-for="(link, index) in userLinks" :link="link.link" :path="link.path" :key="index"/>
        <BaseButton>login</BaseButton>
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