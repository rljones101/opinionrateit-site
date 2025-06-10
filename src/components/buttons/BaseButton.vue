<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'primary' | 'secondary' | 'small'

const props = defineProps<{
  type: ButtonType
  btnType?: 'button' | 'submit' | 'reset' | undefined
}>()

const getClasses = computed(() => {
  const base = 'rounded-lg px-3 py-2 text-sm font-bold uppercase border border-transparent  '

  const classes = {
    primary: base + 'bg-brand-500 text-secondary-50 hover:bg-brand-600',
    secondary: base + 'text-brand-500 bg-brand-50 hover:border-brand-500',
    small:
      'font-semibold uppercase rounded-full px-2 py-0.5 text-xs border border-transparent bg-brand-500 hover:bg-brand-600'
  }
  return classes[props.type]
})
</script>

<template>
  <button
    :type="btnType"
    class="btn transition ease-in-out border border-transparent disabled:pointer-events-none disabled:bg-secondary-500 disabled:text-slate-500 disabled:border-none"
    :class="getClasses"
  >
    <slot />
  </button>
</template>

<style scoped></style>
