<script setup lang="ts">
import UserLogin from '@/components/forms/UserLogin.vue'
import SiteLogo from '@/components/siteLogo.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="main-content-wrapper">
    <div class="flex flex-col items-center justify-center w-full h-screen mx-auto p-8">
      <SiteLogo class="mb-8" />
      <UserLogin />
      <AppFooter />
    </div>
  </div>
</template>

<style scoped></style>
