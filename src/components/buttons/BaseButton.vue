<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'primary' | 'secondary' | 'small'

const props = defineProps<{
  type: ButtonType
  btnType?: 'button' | 'submit' | 'reset' | undefined
}>()

const getClasses = computed(() => {
  const base = 'rounded-lg px-3 py-2 text-sm font-bold uppercase'

  const classes = {
    primary:
      base + ' border border-transparent bg-app-orange text-orange-100 hover:bg-app-orange-muted',
    secondary: base + ' text-app-orange border border-transparent hover:border-app-orange',
    small:
      'font-semibold uppercase rounded-full px-2 py-0.5 text-xs border border-transparent bg-app-orange text-orange-100 hover:bg-app-orange-muted'
  }
  return classes[props.type]
})
</script>

<template>
  <button
    :type="btnType"
    class="btn transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 border hover:border-app-orange disabled:pointer-events-none disabled:bg-gray-700 disabled:text-slate-500 disabled:border-none hover:transform-none"
    :class="getClasses"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  transform: translateY(0);
  transition: all 150ms ease-in-out;
  box-shadow: none;
}

.btn:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0 10px 10px;
}
</style>
