<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue', 'click:rating'])
const selected = ref(props.modelValue)

function updateRating(value: number) {
  const divide = 100 / 7
  emit('update:modelValue', Math.round(value * divide))
  emit('click:rating')
}

const rateHandler = ($event: Event) => {
  const el = $event.target as HTMLInputElement
  const value = el.value
  selected.value = value
  updateRating(Number(value))
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col items-center justify-center">
      <label class="text-white text-center mb-2"><slot /></label>
      <ul class="flex flex-col sr-only">
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="1" @input="rateHandler($event)" />
          <label class="ml-2">Strongly Disagree</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="2" @input="rateHandler($event)" />
          <label class="ml-2">Disagree</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="3" @input="rateHandler($event)" />
          <label class="ml-2">Slightly Disagree</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="4" @input="rateHandler($event)" />
          <label class="ml-2">No opinion</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="5" @input="rateHandler($event)" />
          <label class="ml-2">Slightly Agree</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="6" @input="rateHandler($event)" />
          <label class="ml-2">Agree</label>
        </li>
        <li class="flex items-center pl-3">
          <input type="radio" name="list-survey" :value="7" @input="rateHandler($event)" />
          <label class="ml-2">Strongly Agree</label>
        </li>
      </ul>
      <div class="flex flex-col md:flex-row items-center gap-2">
        <div class="flex items-center space-x-2">
          <p class="text-yellow-500">Disagree</p>
          <div class="flex items-center gap-2">
            <div
              class="disagree-btn w-12 h-12"
              @click="updateRating(1)"
              :class="{ selected: selected == 1 }"
            ></div>
            <div
              class="disagree-btn w-10 h-10"
              @click="updateRating(2)"
              :class="{ selected: selected == 2 }"
            ></div>
            <div
              class="disagree-btn w-8 h-8"
              @click="updateRating(3)"
              :class="{ selected: selected == 3 }"
            ></div>
          </div>
        </div>
        <div
          class="neutral-btn w-6 h-6"
          @click="updateRating(4)"
          :class="{ selected: selected == 4 }"
        ></div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center gap-2">
            <div
              class="agree-btn w-8 h-8"
              @click="updateRating(5)"
              :class="{ selected: selected == 5 }"
            ></div>
            <div
              class="agree-btn w-10 h-10"
              @click="updateRating(6)"
              :class="{ selected: selected == 6 }"
            ></div>
            <div
              class="agree-btn w-12 h-12"
              @click="updateRating(7)"
              :class="{ selected: selected == 7 }"
            ></div>
          </div>
          <p class="text-green-500">Agree</p>
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
