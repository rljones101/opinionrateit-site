import { ref, onMounted, onUnmounted } from 'vue'

export function useLazyLoading(threshold = 0.1) {
  const isVisible = ref(false)
  const targetRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const startObserving = () => {
    if (!targetRef.value || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
          }
        })
      },
      {
        threshold,
        rootMargin: '50px'
      }
    )

    observer.observe(targetRef.value)
  }

  const stopObserving = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    startObserving()
  })

  onUnmounted(() => {
    stopObserving()
  })

  return {
    isVisible,
    targetRef,
    startObserving,
    stopObserving
  }
}

export function useImageLazyLoading() {
  const { isVisible, targetRef } = useLazyLoading(0.1)
  const imageLoaded = ref(false)
  const imageError = ref(false)

  const handleImageLoad = () => {
    imageLoaded.value = true
  }

  const handleImageError = () => {
    imageError.value = true
  }

  return {
    isVisible,
    targetRef,
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError
  }
}