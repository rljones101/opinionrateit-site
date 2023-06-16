<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'
import AppTitle from '@/components/AppTitle.vue'
</script>

<template>
  <div class="md:flex items-center p-8 gap-4 rounded">
    <div class="mb-8 md:mb-0">
      <AppTitle>What analytics are measured?</AppTitle>
      <p class="p-4">Below you will find the metrics that we help collect:</p>
      <ul style="margin: 10px">
        <li>
          <span class="definition-word">Clarity</span>
          <span class="metric-definition"
            >- Reviewer is easy to understand and explains the product clearly</span
          >
        </li>
        <li>
          <span class="definition-word">Product Viewability</span>
          <span class="metric-definition"
            >- Reviewer was able to show the product in great detail</span
          >
        </li>
        <li>
          <span class="definition-word">Product Detail Explanation</span>
          <span class="metric-definition"
            >- Reviewer explained specific details about what they liked/disliked</span
          >
        </li>
        <li>
          <span class="definition-word">Non bias review</span>
          <span class="metric-definition">- Reviewer gave a non bias review</span>
        </li>
        <li>
          <span class="definition-word">Average Review Time</span>
          <span class="metric-definition">- No longer than a 20 minute review</span>
        </li>
        <li>
          <span class="definition-word">Product Focus</span>
          <span class="metric-definition">- Reviewer stayed on topic</span>
        </li>
        <li>
          <span class="definition-word">Provided additional resources</span>
          <span class="metric-definition"
            >- Provided additional links and information for the user to review themselves</span
          >
        </li>
        <li>
          <span class="definition-word">Overall Presentation</span>
          <span class="metric-definition"
            >- Presentation was well lit, HiRes audio and video recording</span
          >
        </li>
      </ul>
    </div>
    <div class="flex flex-col items-center gap-4 flex-1 bg-slate-800 p-8 rounded shadow-lg">
      <h1 class="p-4 font-bold text-white text-2xl">Become a reviewer!</h1>
      <p>
        Join our online community and help us expand our existing reviewer base! New Tech is being
        produced at a rapid pace and so are Tech reviewers. By becoming a member you can share with
        others one of your favorites!
      </p>
      <div class="flex gap-4">
        <BaseButton class="mt-4 w-40 bg-orange-500 hover:bg-orange-600">Sign Up</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.definition-word {
  @apply text-white font-bold;
}
</style>
