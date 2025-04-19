<template>
  <ConfirmModal @confirmed="handleConfirm" @cancelled="handleCancelled">
    <template #title> Publish Videos </template>
    <template #confirmMessage>
      <p class="text-base leading-relaxed">
        Are you sure you wish to publish the following videos?
      </p>
      <ul class="ml-8 mt-4">
        <li v-for="video in selectedVideos" :key="video.videoId">
          <CheckListItem :line-through="false" :is-checked="true" class="flex gap-4 items-center"
            ><span class="text-white">{{ video.title }}</span></CheckListItem
          >
        </li>
      </ul>
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import CheckListItem from '@/components/CheckListItem.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

defineProps<{
  selectedVideos: any[]
}>()

const emit = defineEmits(['confirmed', 'cancelled'])

function handleConfirm() {
  emit('confirmed')
}

function handleCancelled() {
  emit('cancelled')
}
</script>

<style scoped></style>
