<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'

defineProps<{
  yesLabel?: string
  noLabel?: string
}>()

const emit = defineEmits(['confirmed', 'cancelled'])

const close = () => {
  emit('cancelled')
}

const confirm = () => {
  emit('confirmed')
}
</script>

<template>
  <div
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-slate-800 rounded-lg shadow dark:bg-app-blue-soft">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t border-slate-600">
          <h3 class="text-xl font-semibold text-text-white lg:text-2xl dark:text-orange-100">
            <slot name="title" />
          </h3>
          <button
            id="closeButton"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click="close"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6 text-sm leading-relaxed text-orange-100">
          <slot name="confirmMessage" />
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center justify-end p-6 space-x-2 border-t border-slate-600 rounded-b"
        >
          <BaseButton
            class="border border-app-orange text-app-orange hover:bg-app-orange hover:text-white"
            @click="confirm"
          >
            {{ yesLabel ? yesLabel : 'Yes' }}
          </BaseButton>
          <BaseButton
            class="text-white border border-transparent hover:border-white"
            @click="close"
          >
            {{ noLabel ? noLabel : 'No' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
