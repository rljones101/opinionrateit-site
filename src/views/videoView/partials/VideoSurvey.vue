<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'
import MetricInput from '@/components/MetricInput.vue'
import { useSurvey } from '@/views/videoView/composables/useSurvey'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const {
  reviewForm,
  showReviewForm,
  allSurveyQuestionsAnswered,
  questionNumber,
  currentQuestion,
  answerQuestion,
  showSurvey,
  addReview
} = useSurvey()

// v-if="userStore.restrictTo('user')"
</script>

<template>
  <div class="bg-secondary-50 p-4 mt-8 rounded shadow" v-if="userStore.restrictTo('user')">
    <!-- review form -->
    <div class="form-wrapper" :class="[{ open: showReviewForm }]">
      <div
        v-if="!allSurveyQuestionsAnswered"
        key="questions"
        class="w-full flex items-center justify-center min-h-0"
      >
        <TransitionGroup name="slide-fade" tag="div" class="survey-wrapper">
          <MetricInput
            v-if="!allSurveyQuestionsAnswered && currentQuestion"
            :key="questionNumber"
            v-model="currentQuestion.model.value"
            class="survey-question"
            @click:rating="answerQuestion(currentQuestion)"
            >{{ currentQuestion.question }}</MetricInput
          >
        </TransitionGroup>
      </div>
      <Transition name="slide-fade">
        <div key="comment" v-if="allSurveyQuestionsAnswered" class="w-full mb-4">
          <label for="message" class="block mb-2">Your Comment</label>
          <textarea
            id="message"
            rows="4"
            v-model="reviewForm.comment"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>
      </Transition>
    </div>
    <!-- controls -->
    <div class="button-controls flex gap-4">
      <BaseButton v-if="!showReviewForm" type="primary" @click="showSurvey">Add Review</BaseButton>
      <BaseButton v-if="showReviewForm" type="primary" @click="showSurvey">Cancel</BaseButton>
      <BaseButton v-if="allSurveyQuestionsAnswered" type="primary" @click="addReview"
        >Submit Review</BaseButton
      >
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 200ms ease-in-out;
}

.form-wrapper.open {
  grid-template-rows: 1fr;
}

.survey-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  width: 100%;
}

.survey-question {
  position: absolute;
  inset: 0;
  flex: 1;
}
</style>
