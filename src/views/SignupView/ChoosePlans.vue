<script setup lang="ts">
import { useSignupStore } from '@/stores/signupStore'
const signupStore = useSignupStore()
</script>

<template>
  <ol class="mt-8 flex flex-col w-full">
    <li
      class="relative flex w-full"
      v-for="(step, index) in signupStore.selectedPlan.steps"
      :key="step"
    >
      <div
        v-if="index < signupStore.selectedPlan.steps.length - 1"
        class="bg-gray-500 w-0.5 absolute left-2.5 top-0 bottom-0"
      ></div>
      <div class="flex flex-col mb-8">
        <div
          class="z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0"
          :class="[
            { 'bg-blue-600 dark:bg-app-orange-muted': signupStore.isCurrentStepDone(step) },
            { 'bg-gray-200 dark:bg-gray-700': !signupStore.isCurrentStepDone(step) }
          ]"
        >
          <svg
            v-if="signupStore.isCurrentStepDone(step)"
            aria-hidden="true"
            class="w-4 h-4 text-blue-100 dark:text-blue-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            v-if="!signupStore.isCurrentStepDone(step)"
            aria-hidden="true"
            class="w-3 h-3 text-gray-800 dark:text-gray-300"
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
        </div>
        <!--              <div-->
        <!--                v-if="index !== selectedPlan.steps.length - 1"-->
        <!--                class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"-->
        <!--              ></div>-->
      </div>
      <div class="ml-8">
        <h3 class="font-medium text-gray-900 dark:text-white">{{ step }}</h3>
      </div>
    </li>
  </ol>
</template>

<style scoped></style>
