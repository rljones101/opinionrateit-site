<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import axios from "axios"
import AppHeader from './components/appHeader.vue'
import JoinMessage from "@/components/JoinMessage.vue";

const state = reactive({ count: 0})
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
    <JoinMessage />
    <div class="flex justify-center">
      <RouterView />
    </div>
    <footer class="flex justify-center">
      <p>&copy; by Rick Jones. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>

</style>
