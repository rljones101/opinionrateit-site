<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  reviewId: string
  parentReplyId?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Write a reply...'
})

const emit = defineEmits<{
  submit: [content: string]
  cancel: []
}>()

const content = ref('')
const maxLength = 500

const handleSubmit = () => {
  if (content.value.trim()) {
    emit('submit', content.value.trim())
    content.value = ''
  }
}

const handleCancel = () => {
  content.value = ''
  emit('cancel')
}
</script>

<template>
  <div class="reply-form">
    <textarea
      v-model="content"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="reply-textarea"
      rows="3"
    ></textarea>
    
    <div class="reply-form-footer">
      <span class="character-count" :class="{ 'text-red-500': content.length >= maxLength }">
        {{ content.length }}/{{ maxLength }}
      </span>
      
      <div class="reply-form-actions">
        <button
          type="button"
          class="cancel-button"
          @click="handleCancel"
        >
          Cancel
        </button>
        
        <button
          type="button"
          class="submit-button"
          :disabled="!content.trim()"
          @click="handleSubmit"
        >
          Reply
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "#main.css";

.reply-form {
  @apply space-y-2;
}

.reply-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply resize-none;
}

.reply-form-footer {
  @apply flex items-center justify-between;
}

.character-count {
  @apply text-xs text-gray-500;
}

.reply-form-actions {
  @apply flex gap-2;
}

.cancel-button {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg;
  @apply hover:bg-gray-50 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1;
}

.submit-button {
  @apply px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg;
  @apply hover:bg-blue-700 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
