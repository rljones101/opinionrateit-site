import { onMounted, onUnmounted, ref} from 'vue'

export interface Slide {
  id: number,
  name: string,
  style: { opacity:number }
}

const useCarousel = (slides: Slide[]) => {

  const slideAlias = ref(slides)

  const animateCarousel = () => {
    next()
  }

  let animateId = window.setInterval(animateCarousel, 3000)

  const updateOpacity = (slide: Slide) => {
    slideAlias.value.forEach((el: Slide) => {
      el.style.opacity = 1
    });
    slide.style.opacity = 0
    animateId = window.setInterval(animateCarousel, 3000)
  }

  const next = () => {
    window.clearInterval(animateId)

    // Take the first element and add it at the end
    const first: any = slideAlias.value.shift();
    updateOpacity(first as Slide);
    slideAlias.value = [...slideAlias.value, first];
  }

  const previous = () => {
    window.clearInterval(animateId)
    // Save the last element and then add it back to the slides
    // at the beginning
    const last: any = slideAlias.value.pop();
    updateOpacity(last as Slide);
    slideAlias.value = [last, ...slideAlias.value];
  }

  onMounted(() => {
    animateCarousel()
  })

  onUnmounted(() => {
    window.clearInterval(animateId)
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