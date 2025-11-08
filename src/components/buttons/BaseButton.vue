<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'small'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  // Legacy support
  btnType?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button'
})

const getClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 border border-transparent',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border border-transparent',
    small: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 border border-transparent px-2 py-0.5 text-xs rounded-full font-semibold uppercase'
  }
  
  // Handle legacy 'small' variant
  if (props.variant === 'small') {
    return `${baseClasses} ${variantClasses.small}`
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`
})
</script>

<template>
  <button
    :type="type || btnType"
    :disabled="disabled"
    :class="getClasses"
  >
    <slot />
  </button>
</template>

<style scoped></style>
