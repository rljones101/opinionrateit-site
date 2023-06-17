<script setup lang="ts">
import UserLogin from '@/components/forms/UserLogin.vue'
import SiteLogo from '@/components/siteLogo.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen mx-auto p-8">
    <SiteLogo />
    <UserLogin />
    <AppFooter />
  </div>
</template>

<style scoped></style>
