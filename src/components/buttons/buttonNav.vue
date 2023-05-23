<script setup lang="ts">
defineProps<{
  link: string
}>()
const goToPath = () => {
  this.$router.push(this.link)
}
</script>

<template>
  <div class="relative group ml-4 mr-4">
    <button class="flex transition ease-out hover:ease-in duration-300 pt-2 pb-2 uppercase" @click="goToPath">{{link}}</button>
    <span class="absolute -bottom-1 w-0 h-1 bg-orange-500 transition-all group-hover:w-full"></span>
  </div>
</template>

<style scoped>

</style>