<script setup lang="ts">
import {onUnmounted, ref} from 'vue'
const props = defineProps<{
  slides: any[]
}>()

const slidesAlias = ref(props.slides)
const animateCarousel = () => {
  next()
}

let animateId = window.setInterval(animateCarousel, 3000)

const updateOpacity = (slide) => {
  slidesAlias.value.forEach((el) => {
    el.style.opacity = 1
  });
  slide.style.opacity = 0
  animateId = window.setInterval(animateCarousel, 3000)
}

const next = () => {
  window.clearInterval(animateId)

  // Take the first element and add it at the end
  const first = slidesAlias.value.shift();
  updateOpacity(first);
  slidesAlias.value = [...slidesAlias.value, first];
}

const previous = () => {
  window.clearInterval(animateId)
  // Save the last element and then add it back to the slides
  // at the beginning
  const last = slidesAlias.value.pop();
  updateOpacity(last);
  slidesAlias.value = [last, ...slidesAlias.value];
}

onUnmounted(() => {
  window.clearInterval(animateId)
})

</script>

<template>
  <div class="carousel_container">
    <transition-group class="carousel gap-4" tag="div">
      <div v-for="slide in slidesAlias" :key="slide.id" class="slide" :style="slide.style">
        <slot name="slide" v-bind="slide"></slot>
      </div>
    </transition-group>
    <div class="controls">
      <button class="controls_button border border-slate-700 font-bold hover:bg-orange-500 p-4 rounded" @click=previous>&#60;</button>
      <button class="controls_button border border-slate-700 font-bold hover:bg-orange-500 p-4 rounded" @click=next>&#62;</button>
    </div>
  </div>
</template>

<style scoped>
.carousel_container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carousel_container .carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;
  padding: 4rem 0;
  margin: -4rem 4rem;
}

.carousel_container .carousel .slide {
  flex: 0 0 100%;
  opacity: 1;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  background: var(--vt-c-blue);
  max-width: 250px;
  max-height: 450px;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.2);
}

.carousel_container .controls {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  z-index: 300;
  padding: 0;
}
</style>