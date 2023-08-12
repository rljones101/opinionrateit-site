<script setup lang="ts">
import JoinMessage from '@/components/JoinMessage.vue'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import IconEcosystem from '@/components/icons/IconEcosystem.vue'
import AppHero from '@/components/AppHero.vue'
import { useRevealObserver } from '@/composables/useRevealObserver'
import AppHeader from '@/components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import siteLogo from '@/components/siteLogo.vue'
import { nextTick, onMounted } from 'vue'
useRevealObserver()

const callback = (entries: any[]) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1)
  })
}

const observer: IntersectionObserver = new IntersectionObserver(callback, { threshold: [1] })

onMounted(async () => {
  await nextTick()
  const el = document.querySelector('.app-header') as HTMLElement
  observer.observe(el)
})
</script>

<template>
  <div class="main-content-wrapper flex flex-col w-full h-full overflow-y-auto">
    <div class="relative max-w-7xl mx-auto p-8 flex flex-col items-center justify-center pl-4 pr-4">
      <site-logo />
    </div>
    <div
      class="relative flex flex-col max-w-7xl mx-auto rounded-lg shadow-lg shadow-gray-950 bg-app-blue"
    >
      <AppHeader class="app-header sticky -top-1 z-30" />
      <section class="text-white p-8 flex flex-col items-center justify-center">
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
          <h1 class="pt-16 flex justify-center text-4xl text-white text-center uppercase">
            Activate more effective reviews
          </h1>
          <div class="w-full flex flex-col items-center mt-8 mb-8">
            <img src="../assets/img/desktop-split.png" alt="Desktop Image" class="object-contain" />
          </div>
          <div
            class="px-24 pb-24 flex flex-col md:flex-row w-full gap-4 items-stretch justify-center"
          >
            <div
              class="flex-1 flex flex-col items-center text-center gap-4 bg-app-blue-soft p-4 rounded"
            >
              <div class="icon-wrapper"><IconCommunity /></div>
              <h3 class="font-bold text-2xl text-white uppercase">Community</h3>
              <p>
                Interact with other members and ensure your reviews are engaging while providing
                valuable information.
              </p>
              <!--            <ReadMoreLink />-->
            </div>
            <div
              class="flex-1 flex flex-col items-center text-center gap-4 bg-app-blue-soft p-4 rounded"
            >
              <div class="icon-wrapper"><IconDocumentation /></div>
              <h3 class="font-bold text-2xl text-white uppercase">Tech Knowledge</h3>
              <p>
                Increase awareness in latest tech trends, connect with merchants that share your
                interest.
              </p>
              <!--            <ReadMoreLink />-->
            </div>
            <div
              class="flex-1 flex flex-col items-center text-center gap-4 bg-app-blue-soft p-4 rounded"
            >
              <div class="icon-wrapper"><IconEcosystem /></div>
              <h3 class="font-bold text-2xl text-white uppercase">Engagement Tracking</h3>
              <p>
                Daily analysis is provided that will give you a deep understanding of how you can
                reach your target audience.
              </p>
              <!--            <ReadMoreLink />-->
            </div>
          </div>
        </div>
      </section>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.icon-wrapper {
  @apply bg-orange-500 rounded-full p-4 text-white;
  width: 50px;
  height: 50px;
}
/*
.background-desktop-split-image {
  background-image: url('../assets/img/desktop-split.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
*/
</style>
