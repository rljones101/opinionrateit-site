<script setup lang="ts">
import JoinMessage from "@/components/JoinMessage.vue";
import FeaturedReviewers from "@/views/FeaturedReviewers.vue";
import IconCommunity from "@/components/icons/IconCommunity.vue";
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconEcosystem from "@/components/icons/IconEcosystem.vue";
import AppHero from "@/components/AppHero.vue";
import ReadMoreLink from "@/components/links/ReadMoreLink.vue";
</script>

<template>
  <section class="section-info bg-slate-700 text-white shadow-lg">
    <AppHero/>
  </section>
  <section>
    <FeaturedReviewers class="max-w-7xl mx-auto" />
  </section>
  <section class="section-info mt-8 bg-slate-700">
    <div class="max-w-7xl mx-auto">
      <h1 class="pt-16 flex justify-center font-bold text-4xl text-white">Activate more effective reviews</h1>
      <div class="points-of-interest p-24 flex flex-col">
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconCommunity /></div>
          <h3 class="font-bold text-2xl text-white">Community</h3>
          <p>Urna magna te verear dissentiunt tibique definitionem voluptaria cum quod porro ante habitasse fermentum propriae doming viverra honestatis pharetra inciderint.</p>
          <ReadMoreLink />
        </div>
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconDocumentation/></div>
          <h3 class="font-bold text-2xl text-white">Tech Knowledge</h3>
          <p>lacinia expetendis singulis enim integer salutatus convallis tritani intellegat impetus expetenda conubia ignota has facilisi suspendisse graeci vero iudicabit suscipit veritus inani dicta error venenatis vivamus nihil porro.</p>
          <ReadMoreLink />
        </div>
        <div class="flex flex-col gap-4">
          <div class="icon-wrapper"><IconEcosystem /></div>
          <h3 class="font-bold text-2xl text-white">Engagement Tracking</h3>
          <p>eu dicit pellentesque laoreet pretium condimentum elitr ne ex reprimique utinam integer pretium electram nostrum wisi morbi simul tempus tota esse alterum mandamus cu eloquentiam dolorem repudiandae mattis.</p>
          <ReadMoreLink />
        </div>
      </div>
    </div>
  </section>
  <section class="mt-8">
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