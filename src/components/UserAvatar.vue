<script setup lang="ts">
import reviewerController from '@/controllers/reviewerController'
import { computed, ref } from 'vue'

const props = defineProps<{
  src?: string
  name: string
}>()

// template refs
const showImage = ref(false)

function testImage(url: string) {
  return new Promise(function (resolve, reject) {
    const image = new Image()
    image.addEventListener('load', resolve)
    image.addEventListener('error', reject)
    image.src = url
  })
}

if (props.src) {
  testImage(props.src)
    .then(() => {
      showImage.value = true
      console.log('show the avatar image!!!')
    })
    .catch(() => {
      console.log('Could not load avatar image!')
      showImage.value = false
    })
}

const initials = computed(() => reviewerController.getInitials(props.name))
</script>

<template>
  <div>
    <img :alt="name" :src="src" v-if="showImage" class="rounded-full shadow-lg shadow-black" />
    <div
      v-else
      class="bg-app-blue w-full h-full flex items-center justify-center text-app-orange font-bold text-lg uppercase rounded-full shadow-lg shadow-black"
    >
      {{ initials }}
    </div>
  </div>
</template>

<style scoped></style>
