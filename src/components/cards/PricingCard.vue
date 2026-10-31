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
    :class="active ? 'border border-orange-500' : 'border border-app-light-blue'"
    class="w-full flex flex-col max-w-sm p-4 bg-secondary-200 rounded-lg shadow sm:p-8 h-full"
  >
    <h5 class="mb-4 text-xl font-medium">{{ planName }}</h5>
    <div class="flex items-baseline" v-if="!isDisabled">
      <span class="text-3xl font-semibold" v-if="pricing">$</span>
      <span class="text-5xl font-extrabold tracking-tight" v-if="pricing">{{ pricing }}</span>
      <span class="text-5xl font-extrabold tracking-tight" v-if="!pricing">Free</span>
      <span class="ml-1 text-xl font-normal text-default-300">/month</span>
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
    <ul role="list" class="space-y-5 my-7 flex-grow">
      <slot name="list"></slot>
    </ul>
    <BaseButton
      :class="{
        'bg-orange-500 shadow-none border-none hover:transition-none hover:translate-y-0 text-white':
          active
      }"
      variant="primary"
      class="mt-auto"
      @click="emit('selected')"
      :disabled="isDisabled"
      >{{ active ? 'Continue' : isDisabled ? 'Comming Soon' : 'Choose Plan' }}</BaseButton
    >
    <!--    <p class="text-sm mt-8 text-center">( 30 day trial run )</p>-->
  </div>
</template>

<style scoped></style>
