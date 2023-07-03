<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'

defineProps<{
  active?: boolean
  planName: string
  pricing?: string
  annualDiscountPrice?: string
  isDisabled?: boolean
}>()

const emit = defineEmits(['selected'])
</script>

<template>
  <div
    :class="{ 'active-plan': active }"
    class="w-full flex flex-col max-w-sm p-4 bg-app-blue-soft text-white rounded-lg shadow-lg shadow-black sm:p-8"
  >
    <h5 class="mb-4 text-xl font-medium dark:text-gray-400">{{ planName }}</h5>
    <div class="flex items-baseline dark:text-white" v-if="!isDisabled">
      <span class="text-3xl font-semibold" v-if="pricing">$</span>
      <span class="text-5xl font-extrabold tracking-tight" v-if="pricing">{{ pricing }}</span>
      <span class="text-5xl font-extrabold tracking-tight" v-if="!pricing">Free</span>
      <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
    </div>
    <div v-else>
      <span class="text-5xl font-extrabold tracking-tight">TBD</span>
    </div>
    <div class="h-4 pt-4 pb-4">
      <div v-if="annualDiscountPrice && !isDisabled" class="italic">
        ${{ annualDiscountPrice }} yearly discount
      </div>
    </div>

    <!-- List -->
    <ul role="list" class="space-y-5 my-7">
      <slot name="list"></slot>
    </ul>
    <BaseButton
      :class="{ 'active-button': active }"
      :is-primary="true"
      @click="emit('selected')"
      :disabled="active || isDisabled"
      >{{ active ? 'Selected' : isDisabled ? 'Comming Soon' : 'Choose Plan' }}</BaseButton
    >
    <!--    <p class="text-sm mt-8 text-center">( 30 day trial run )</p>-->
  </div>
</template>

<style scoped>
.active-plan {
  @apply border border-orange-500;
}
.active-button {
  @apply bg-orange-500
  shadow-none
  border-none
  disabled:bg-app-blue
  hover:transition-none
  hover:translate-y-0
  text-orange-500;
}
</style>
