<script setup lang="ts">
import AppHero from '@/components/AppHero.vue'
import ValueProposition from '@/components/home/ValueProposition.vue'
import HomePricing from '@/components/home/HomePricing.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import QualityFeatures from '@/components/home/QualityFeatures.vue'
import StatsBar from '@/components/home/StatsBar.vue'
import FinalCTA from '@/components/home/FinalCTA.vue'
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
    if (el) observer.observe(el)
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}
</script>

<template>
  <MainContentWrapper>
    <!-- Hero -->
    <section class="p-8 flex flex-col items-center justify-center">
      <AppHero />
    </section>

    <!-- Value Proposition -->
    <section id="learn-more" class="py-16 px-8 bg-secondary-200/40 reveal fade-up">
      <ValueProposition class="max-w-7xl mx-auto" />
    </section>

    <!-- Pricing Tiers -->
    <section class="py-16 px-8 reveal fade-up">
      <HomePricing class="max-w-7xl mx-auto" />
    </section>

    <!-- How It Works -->
    <section class="py-16 px-8 bg-secondary-200/40 reveal fade-up">
      <HowItWorks class="max-w-7xl mx-auto" />
    </section>

    <!-- Quality / Features -->
    <section class="py-16 px-8 reveal fade-up">
      <QualityFeatures class="max-w-7xl mx-auto" />
    </section>

    <!-- Social Proof -->
    <section class="py-16 px-8 bg-secondary-200/40 reveal fade-up">
      <StatsBar class="max-w-7xl mx-auto" />
    </section>

    <!-- Final CTA -->
    <section class="reveal fade-up">
      <FinalCTA />
    </section>
  </MainContentWrapper>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>
