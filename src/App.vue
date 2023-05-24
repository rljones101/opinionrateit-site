<script setup lang="ts">
import { reactive } from 'vue'
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
  <div class="max-w-7xl mx-auto">
    <AppHeader />
    <div class="flex flex-col justify-center max-w-7xl mx-auto">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>

</style>
