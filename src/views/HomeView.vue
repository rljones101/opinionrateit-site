<script setup lang="ts">
import JoinMessage from '@/components/JoinMessage.vue'
import FeaturedReviewers from '@/components/FeaturedReviewers.vue'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import IconEcosystem from '@/components/icons/IconEcosystem.vue'
import AppHero from '@/components/AppHero.vue'
import ReadMoreLink from '@/components/links/ReadMoreLink.vue'
import { useRevealObserver } from '@/controllers/observerController'
import AppHeader from '@/components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
useRevealObserver()
</script>

<template>
  <AppHeader class="sticky-header" />
  <div class="flex flex-col overflow-y-auto">
    <section class="section-info bg-slate-800 text-white shadow-lg reveal fade-top">
      <AppHero class="relative z-30" />
    </section>
    <section>
      <FeaturedReviewers class="reveal fade-right overflow-hidden relative z-20" />
    </section>
    <section class="section-info mt-8 bg-slate-800 reveal fade-bottom">
      <div class="max-w-7xl mx-auto">
        <h1 class="pt-16 flex justify-center font-bold text-4xl text-white text-center">
          Activate more effective reviews
        </h1>
        <div class="p-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col gap-4">
            <div class="icon-wrapper"><IconCommunity /></div>
            <h3 class="font-bold text-2xl text-white">Community</h3>
            <p>
              Interact with other members and ensure your reviews are engaging while providing
              valuable information.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
          <div class="flex flex-col gap-4">
            <div class="icon-wrapper"><IconDocumentation /></div>
            <h3 class="font-bold text-2xl text-white">Tech Knowledge</h3>
            <p>
              Increase awareness in latest tech trends, connect with merchants that share your
              interest.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
          <div class="flex flex-col gap-4">
            <div class="icon-wrapper"><IconEcosystem /></div>
            <h3 class="font-bold text-2xl text-white">Engagement Tracking</h3>
            <p>
              Daily analysis is provided that will give you a deep understanding of how you can
              reach your target audience.
            </p>
            <!--            <ReadMoreLink />-->
          </div>
        </div>
      </div>
    </section>
    <section class="mt-8 reveal fade-left">
      <JoinMessage class="max-w-7xl mx-auto" />
    </section>
    <AppFooter />
  </div>
</template>

<style scoped>
.section-info {
  position: relative;
}

.icon-wrapper {
  @apply bg-orange-500 rounded-full p-4 text-white;
  width: 50px;
  height: 50px;
}
</style>
