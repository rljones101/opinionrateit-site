<script setup lang="ts">
import type { IconStartProps } from '@/types'

withDefaults(defineProps<IconStartProps>(), {
  color: 'text-orange-500'
})
</script>

<template>
  <div class="star-container relative flex items-center justify-center">
    <div class="absolute">
      <svg
        :class="`${color}`"
        width="35"
        height="31"
        viewBox="0 0 55 51"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.9695 34.0714L0 51L28.9695 29.3571L35.0573 33.4286V24.4286L43.874 19.5H35.8969L35.0573 10.0714C33.5878 12.7143 30.5229 18 30.0191 18H18.0534L25.1908 24.4286L17.2137 29.3571L20.5725 24.4286L11.3359 14.7857L28.9695 14.7857L38.416 0L39.0458 16.0714H55L39.0458 26.7857V42.2143L28.9695 34.0714Z"
        />
      </svg>
    </div>
    <div class="absolute text-white font-bold">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.star-container {
  width: 55px;
  height: 51px;
}
</style>
