<script setup lang="ts">
import JoinMessage from "@/components/JoinMessage.vue";
import FeaturedReviewers from "@/views/FeaturedReviewers.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import AppHero from "@/components/AppHero.vue";
import ReadMoreLink from "@/components/links/ReadMoreLink.vue";
import {nextTick, onBeforeUnmount, onMounted} from "vue";

const callback = (entries) => {
  entries.forEach(entry => {
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
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el)
  })
})

onBeforeUnmount(() => {
 observer.disconnect()
})
</script>

<template>
  <section class="section-info bg-slate-700 text-white shadow-lg reveal fade-bottom">
    <AppHero/>
  </section>
  <section >
    <FeaturedReviewers class="max-w-7xl mx-auto reveal fade-right" />
  </section>
  <section class="section-info mt-8 bg-slate-700 reveal fade-bottom">
    <div class="max-w-7xl mx-auto">
      <h1 class="pt-16 flex justify-center font-bold text-4xl text-white">Activate more effective reviews</h1>
      <div class="points-of-interest p-24 flex flex-col">
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconCommunity /></div>
          <h3 class="font-bold text-2xl text-white">Community</h3>
          <p>Interact with other members and ensure your reviews are engaging while providing valuable information.</p>
          <ReadMoreLink />
        </div>
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconDocumentation/></div>
          <h3 class="font-bold text-2xl text-white">Tech Knowledge</h3>
          <p>Increase awareness in latest tech trends, connect with merchants that share your interest.</p>
          <ReadMoreLink />
        </div>
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconEcosystem /></div>
          <h3 class="font-bold text-2xl text-white">Engagement Tracking</h3>
          <p>Daily analysis is provided that will give you a deep understanding of how you can reach your target audience.</p>
          <ReadMoreLink />
        </div>
      </div>
    </div>
  </section>
  <section class="mt-8 reveal fade-left">
    <JoinMessage class="max-w-7xl mx-auto" />
  </section>
</template>

<style scoped>
.section-info {
  position: relative;
}
 .points-of-interest {
   display: grid;
   grid-gap: 1rem;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
 }

 .icon-wrapper {
   @apply bg-orange-500 rounded-full p-4 text-white;
   width: 50px;
   height: 50px;
 }

</style>