<script setup lang="ts">
import {reactive, onMounted, nextTick, onBeforeUnmount} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import axios from "axios"
import AppHeader from './components/appHeader.vue'
import AppFooter from "@/components/AppFooter.vue";

const reviews = reactive([])
const baseApiUrl = 'http://localhost:3000'
// const getReviews = async () => {
//   const res = await axios.get(`${baseApiUrl}/api/v1/reviews`)
//   console.log(res)
// }
//
// getReviews().catch(err => console.error(err))

</script>

<template>
  <div class="">
    <AppHeader class="sticky-header" />
    <div class="flex flex-col justify-center">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>

<style>
.sticky-header{
  @apply sticky top-0 z-50 md:max-w-7xl md:mx-auto lg:max-w-none;
  background-color: var(--vt-c-blue);
}
</style>
