<script setup lang="ts">

</script>

<template>
  <div class="flex items-center border border-slate-700 p-8 gap-4 rounded">
    <div>
      <p class="welcome-title font-bold border-l-4 pl-4 border-orange-500">Welcome to Opinion Rate It!</p>
      <p class="p-4">Here you will find some of the top tech online reviewers. Each reviewer is rank based on the following:</p>
      <ul style="margin: 10px;">
        <li><span class="text-orange-500">Clarity</span> <span class="metric-definition">- Reviewer is easy to understand and explains the product clearly</span></li>
        <li><span class="text-orange-500">Product Viewability</span> <span class="metric-definition">- Reviewer was able to show the product in great detail</span></li>
        <li><span class="text-orange-500">Product Detail Explanation</span> <span class="metric-definition">- Reviewer explained specific details about what they liked/disliked</span></li>
        <li><span class="text-orange-500">Non bias review</span> <span class="metric-definition">- Reviewer gave a non bias review</span></li>
        <li><span class="text-orange-500">Average Review Time</span> <span class="metric-definition">- No longer than a 20 minute review</span></li>
        <li><span class="text-orange-500">Product Focus</span> <span class="metric-definition">- Reviewer stayed on topic</span></li>
        <li><span class="text-orange-500">Provided additional resources</span> <span class="metric-definition">- Provided additional links and information for the user to review themselves</span></li>
        <li><span class="text-orange-500">Overall Presentation</span> <span class="metric-definition">- Presentation was well lit, HiRes audio and video recording</span></li>
      </ul>
    </div>
    <div class="flex flex-col items-center gap-4 flex-1 bg-gray-700 p-8 rounded shadow-lg">
      <h1 class="p-4 font-bold text-orange-500 text-2xl">Become a reviewer!</h1>
      <p>Join our online community and help us expand our existing reviewer base! New Tech is being produced at a rapid pace and so are Tech reviewers. By becoming a member you can share with others one of your favorites!</p>
      <div class="flex w-full gap-4">
        <button class="flex-1 border-2 hover:border-orange-500 hover:bg-orange-500 transition-all rounded-3xl text-white">
          <span class="font-bold">Join</span>
        </button>
        <button class="flex-1 bg-orange-500 rounded-3xl p-2">
          <span class="font-bold p-2 text-white">Login</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>