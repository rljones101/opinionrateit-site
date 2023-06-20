import { onMounted, onUnmounted, ref} from 'vue'
import type { Slide } from "@/types";

const useCarousel = (slides: Slide[]) => {

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
    });
    slide.style.opacity = 0
    startAnimation()
  }

  const next = () => {
    stopAnimation()

    // Take the first element and add it at the end
    const first: any = slideAlias.value.shift();
    updateOpacity(first as Slide);
    slideAlias.value = [...slideAlias.value, first];
  }

  const previous = () => {
    stopAnimation()
    // Save the last element and then add it back to the slides
    // at the beginning
    const last: any = slideAlias.value.pop();
    updateOpacity(last as Slide);
    slideAlias.value = [last, ...slideAlias.value];
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

export {
  useCarousel
}