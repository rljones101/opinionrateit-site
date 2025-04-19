<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import NoAuthLayout from '@/components/layouts/NoAuthLayout.vue'
</script>

<template>
  <NoAuthLayout>
    <AppTitle>Success</AppTitle>
    <p>Great! You are now a Reviewer! Start adding some videos to begin your journey.</p>
    <!-- Add portal button -->
    <form action="/create-portal-session" method="POST">
      <input type="hidden" id="session-id" name="session_id" value="" />
      <button id="checkout-and-portal-button" type="submit">Manage your billing information</button>
    </form>
  </NoAuthLayout>
</template>

<style scoped></style>
