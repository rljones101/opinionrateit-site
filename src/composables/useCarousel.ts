import { onMounted, onUnmounted, ref } from 'vue'
import type { Slide } from '@/types'

export const useCarousel = (slides: Slide[]) => {
  let animateId: number
  const startAnimation = () => {
    animateId = window.setInterval(() => {
      next()
    }, 3000)
  }

  const stopAnimation = () => {
    window.clearInterval(animateId)
  }

  const slideAlias = ref(slides)
  const updateOpacity = (slide: Slide) => {
    slideAlias.value.forEach((el: Slide) => {
      el.style.opacity = 1
    })
    slide.style.opacity = 0
    startAnimation()
  }

  const next = () => {
    stopAnimation()

    // Take the first element and add it at the end
    const first: Slide = slideAlias.value.shift() as Slide
    updateOpacity(first)
    slideAlias.value = [...slideAlias.value, first]
  }

  const previous = () => {
    stopAnimation()
    // Save the last element and then add it back to the slides
    // at the beginning
    const last: Slide = slideAlias.value.pop() as Slide
    updateOpacity(last)
    slideAlias.value = [last, ...slideAlias.value]
  }

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    stopAnimation()
  })

  return {
    slides: slideAlias,
    next,
    previous
  }
}
