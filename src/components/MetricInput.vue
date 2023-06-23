<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue', 'click:rating'])
const selected = ref(props.modelValue)

const rateHandler = (value: number) => {
  selected.value = value
  const divide = 100 / 7
  emit('update:modelValue', Math.round(value * divide))
  emit('click:rating')
}
</script>

<template>
  <div class="h-80 flex items-center justify-center">
    <div class="flex flex-col items-center justify-center space-y-8">
      <label class="font-bold text-white md:text-xl text-center"><slot /></label>
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="flex items-center space-x-8">
          <p class="text-yellow-500 font-bold">Disagree</p>
          <div class="flex items-center">
            <div
              class="disagree-btn w-16 h-16"
              @click="rateHandler(1)"
              :class="{ selected: selected == 1 }"
            ></div>
            <div
              class="disagree-btn w-14 h-14"
              @click="rateHandler(2)"
              :class="{ selected: selected == 2 }"
            ></div>
            <div
              class="disagree-btn w-12 h-12"
              @click="rateHandler(3)"
              :class="{ selected: selected == 3 }"
            ></div>
          </div>
        </div>
        <div
          class="neutral-btn w-10 h-10"
          @click="rateHandler(4)"
          :class="{ selected: selected == 4 }"
        ></div>
        <div class="flex items-center space-x-8">
          <div class="flex items-center">
            <div
              class="agree-btn w-12 h-12"
              @click="rateHandler(5)"
              :class="{ selected: selected == 5 }"
            ></div>
            <div
              class="agree-btn w-14 h-14"
              @click="rateHandler(6)"
              :class="{ selected: selected == 6 }"
            ></div>
            <div
              class="agree-btn w-16 h-16"
              @click="rateHandler(7)"
              :class="{ selected: selected == 7 }"
            ></div>
          </div>
          <p class="text-green-500 font-bold">Agree</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.disagree-btn {
  @apply rounded-full border-2 border-yellow-500 hover:bg-yellow-500 cursor-pointer;
}

.disagree-btn.selected {
  @apply bg-yellow-500;
}

.agree-btn {
  @apply rounded-full border-2 border-green-500 hover:bg-green-500 cursor-pointer;
}

.agree-btn.selected {
  @apply bg-green-500;
}

.neutral-btn {
  @apply rounded-full border-2 border-gray-700 hover:bg-gray-700 cursor-pointer;
}

.neutral-btn.selected {
  @apply bg-gray-700;
}
</style>
