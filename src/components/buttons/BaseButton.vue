<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: string
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

  const cls = Object.keys(classes).find((key) => key === props.type)
  console.log(cls)
  return classes[props.type]
})
</script>

<template>
  <button :type="btnType" class="btn" :class="getClasses"><slot /></button>
</template>

<style scoped>
.btn {
  transform: translateY(0);
  transition: all 150ms ease-in-out;
  box-shadow: none;
}

.btn:hover {
  @apply transition ease-in-out delay-150 -translate-y-1 scale-105 border border-app-orange;
  box-shadow: rgba(0, 0, 0, 0.2) 0 10px 10px;
}
.btn:disabled {
  @apply pointer-events-none bg-gray-700 text-slate-500 border-none transition-none transform-none;
}
</style>
