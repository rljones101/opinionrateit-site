<script setup lang="ts">
import JoinMessage from '@/components/JoinMessage.vue'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import IconEcosystem from '@/components/icons/IconEcosystem.vue'
import AppHero from '@/components/AppHero.vue'
import { nextTick, onMounted, onBeforeUnmount } from 'vue'
import MainContentWrapper from '@/components/containers/MainContentWrapper.vue'

useSetActiveElement('.reveal')
useSetIsPinnedElement('.app-header')

function useSetActiveElement(className: string): void {
  const callback = (entries: any[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      } else {
        entry.target.classList.remove('active')
      }
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback)

  onMounted(async () => {
    await nextTick()
    document.querySelectorAll(className).forEach((el) => {
      observer.observe(el)
    })
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

function useSetIsPinnedElement(className: string): void {
  const callback = (entries: any[]) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1)
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, { threshold: [1] })

  onMounted(async () => {
    await nextTick()
    const el = document.querySelector(className) as HTMLElement
    observer.observe(el)
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}
</script>

<template>
  <MainContentWrapper>
    <section class="p-8 flex flex-col items-center justify-center">
      <AppHero />
    </section>
    <section>
      <JoinMessage class="max-w-7xl mx-auto" />
    </section>
    <!--      <section class="pt-8 pb-8 hidden xl:flex">-->
    <!--        <FeaturedReviewers class="reveal fade-right" />-->
    <!--      </section>-->
    <section>
      <div class="max-w-7xl mx-auto">
        <h1 class="pt-16 flex justify-center text-4xl text-center text-brand-800 uppercase">
          Activate more effective reviews
        </h1>
        <div class="w-full flex flex-col items-center mt-8 mb-8">
          <img src="../assets/img/desktop-split.png" alt="Desktop Image" class="object-contain" />
        </div>
        <div
          class="px-24 pb-24 flex flex-col md:flex-row w-full gap-4 items-stretch justify-center"
        >
          <div
            class="flex-1 flex flex-col items-center text-center gap-4 bg-secondary-200 p-4 rounded"
          >
            <div class="icon-wrapper"><IconCommunity /></div>
            <h3 class="font-bold text-xl text-brand-800 uppercase">Community</h3>
            <p>
              Interact with other members and ensure your reviews are engaging while providing
              valuable information.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
          <div
            class="flex-1 flex flex-col items-center text-center gap-4 bg-secondary-200 p-4 rounded"
          >
            <div class="icon-wrapper"><IconDocumentation /></div>
            <h3 class="font-bold text-xl text-brand-800 uppercase">Tech Knowledge</h3>
            <p>
              Increase awareness in latest tech trends, connect with merchants that share your
              interest.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
          <div
            class="flex-1 flex flex-col items-center text-center gap-4 bg-secondary-200 p-4 rounded"
          >
            <div class="icon-wrapper"><IconEcosystem /></div>
            <h3 class="font-bold text-xl text-brand-800 uppercase">Engagement Tracking</h3>
            <p>
              Daily analysis is provided that will give you a deep understanding of how you can
              reach your target audience.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
        </div>
      </div>
    </section>
  </MainContentWrapper>
</template>

<style scoped>
.icon-wrapper {
  @apply bg-brand-500 text-secondary-50 rounded-full p-4;
  width: 50px;
  height: 50px;
}
</style>
