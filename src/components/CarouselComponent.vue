<script setup lang="ts">
import IconArrow from "@/components/icons/IconArrow.vue";
import { useCarousel, Slide } from "@/controllers/carouselController";

const props = defineProps<{
  slides: Slide[]
}>()

const { slides, next, previous } = useCarousel(props.slides)

</script>

<template>
  <div class="carousel_container">
    <transition-group class="carousel gap-4" tag="div">
      <div v-for="slide in slides" :key="slide.id" class="slide" :style="slide.style">
        <slot name="slide" v-bind="slide"></slot>
      </div>
    </transition-group>
    <div class="controls">
      <button class="controls_button" @click=previous>
        <IconArrow />
      </button>
      <button class="controls_button" @click=next>
        <IconArrow class="rotate-180" />
      </button>
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
  margin: -4rem 0;
}

.carousel_container .carousel .slide {
  flex: 0 0 100%;
  opacity: 1;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  background: var(--vt-c-blue);
  max-width: 305px;
  max-height: 450px;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.2);
}

.carousel_container .controls {
  @apply z-20;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -50px;
  display: flex;
  justify-content: center;
  padding: 0;
  gap: 1rem;
}

.carousel_container .controls .controls_button {
  @apply
  flex
  justify-center
  items-center
  border
  border-slate-700
  font-bold
  bg-orange-500
  hover:bg-orange-600
  p-4
  rounded;

  width: 44px;
  height: 44px;
  box-shadow: rgba(0,0,0, 0.5) 0 10px 10px
}
</style>