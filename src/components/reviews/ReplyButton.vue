<script setup lang="ts">
interface Props {
  replyCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="reply-button"
    @click.stop="emit('click')"
    type="button"
  >
    <svg class="reply-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
    
    <span class="reply-text">Reply</span>
    <span v-if="replyCount > 0" class="reply-count">({{ replyCount }})</span>
  </button>
</template>

<style scoped>
@reference "#main.css";

.reply-button {
  @apply inline-flex items-center gap-1 px-3 py-1.5 rounded-lg;
  @apply text-gray-600 hover:text-green-600 hover:bg-green-50;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1;
}

.reply-icon {
  @apply w-5 h-5;
}

.reply-text {
  @apply text-sm font-medium;
}

.reply-count {
  @apply text-sm;
}
</style>
