<script setup lang="ts">
import { computed, ref } from 'vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import videoViewController from '@/controllers/videoViewController'
import { useRoute } from 'vue-router'
import type { KeyOfReviewFormValues, Review, SurveyQuestion } from '@/types'
import { reviewDate } from '@/utils/DateUtils'
import { replaceNewlines, urlify } from '@/utils/StringUtils'
import BaseButton from '@/components/buttons/BaseButton.vue'
import MetricInput from '@/components/MetricInput.vue'
import { useUserStore } from '@/stores/user'
import { formatPercentageToRating } from '@/utils/StringUtils'
import ContentReadMore from '@/components/ContentReadMore.vue'
import type { ReviewFormValues } from '@/types'

const route = useRoute()
const user = useUserStore()
const videoId = route.params.videoId as string
const channelId = route.params.channelId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='
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
const { reviews, getReviews } = useReviews()

const itemDetail = ref({
  title: '',
  creator: '',
  description: '',
  price: '',
  social: [],
  youTubeId: videoId,
  youtubeURL: `${youTubeBaseUrl}${videoId}`
})

videoViewController.getVideo(videoId).then((res: any) => {
  if ('items' in res) {
    const snippet = res.items[0].snippet
    itemDetail.value.title = snippet.localized.title
    itemDetail.value.description = replaceNewlines(urlify(snippet.localized.description))
    itemDetail.value.creator = snippet.channelTitle
  }
})


function useReviews() {
  const reviews = ref<Review[]>([])
  const getReviews = () => {
    videoViewController.getReviewsByVideo(videoId).then((res) => {
      reviews.value = res.data.data
    })
  }
  return {
    reviews,
    getReviews
  }
}

function useSurvey() {
  
  const defaultFormValues: ReviewFormValues = {
      channelId: route.params.channelId as string,
      videoId: route.params.videoId as string,
      overall_presentation: 0,
      clarity: 0,
      product_view: 0,
      product_detail_explanation: 0,
      non_bias: 0,
      average_review_time: 0,
      product_focus: 0,
      provided_resources: 0,
      comment: ''
    }

  const reviewForm = ref<ReviewFormValues>({ ...defaultFormValues })

  const questionNumber = ref(1)
  const showReviewForm = ref(false)

  const showSurvey = () => {
    showReviewForm.value = !showReviewForm.value
    if (!showReviewForm.value) {
      // reset question number
      questionNumber.value = 1
      // reset form values
      reviewForm.value = { ...defaultFormValues }
    }
  }
  const hideSurvey = () => {
    showReviewForm.value = false
    // reset question number
    questionNumber.value = 1
    // reset form values
    reviewForm.value = { ...defaultFormValues }
  }

  const reviewQuestions = ref<SurveyQuestion[]>(videoViewController.getReviewQuestions())
  const allSurveyQuestionsAnswered = computed(() => {
    return questionNumber.value > reviewQuestions.value.length
  })
  const currentQuestion = computed(() => {
    return reviewQuestions.value.find((q) => q.id === questionNumber.value)
  })

  const setFormValue = <K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) => {
    return reviewForm.value[key] = value
  }

  const answerQuestion = (question: SurveyQuestion) => {
    // set the question value
    const key: KeyOfReviewFormValues = question.model.field
    setFormValue(key, question?.model?.value)
    // get the next question
    questionNumber.value++
  }

  const addReview = async () => {
    try {
      await videoViewController.addReview(reviewForm.value)
      // refresh the reviews list
      getReviews()
      // close the form
      hideSurvey()
    } catch (err) {
      console.error(err)
    }
  }

  return {
    allSurveyQuestionsAnswered,
    currentQuestion,
    questionNumber,
    showSurvey,
    hideSurvey,
    answerQuestion,
    addReview,
    reviewForm,
    showReviewForm
  }
}

getReviews()
</script>

<template>
  <div class="w-full relative">
    <div class="mb-8">
      <router-link to="/reviewers" class="text-orange-500 hover:underline">Reviewers</router-link>
      /
      <router-link
        :to="{ name: 'reviewers-channelId-reviews', params: { channelId } }"
        class="text-orange-500 hover:underline"
        >{{ itemDetail.creator }}</router-link
      >
      /
      {{ itemDetail.title }}
      review
    </div>
    <div class="max-w-7xl mx-auto">
      <div class="shadow-lg shadow-black">
        <div key="videoArea" class="relative bg-app-blue border border-slate-800 p-8 rounded">
          <div class="w-full flex flex-col gap-8" v-if="itemDetail && itemDetail.youTubeId">
            <!-- video player -->
            <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold text-white uppercase">{{ itemDetail.title }}</h3>
                <p class="text-sm" v-if="itemDetail.creator">
                  Review by:
                  <router-link
                    :to="{ name: 'reviewers-channelId-reviews', params: { channelId } }"
                    >{{ itemDetail.creator }}</router-link
                  >
                </p>
              </div>
              <BaseButton type="primary"> Bookmark </BaseButton>
            </div>
            <!-- description container -->
            <div class="rounded bg-app-blue-soft p-4 max-w-full">
              <div class="flex items-center gap-4 text-white">
                <span>99K views</span>
                <span>8 days ago</span>
              </div>
              <ContentReadMore>
                <div class="text-sm description-content" v-html="itemDetail.description"></div>
              </ContentReadMore>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-app-blue-soft p-4 mt-8 rounded-lg shadow shadow-black"
        v-if="user.restrictTo('user')"
      >
        <!-- review form -->
        <div class="form-wrapper" :class="[{ open: showReviewForm }]">
          <!--          <pre key="10">{{ reviewForm }}</pre>-->
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
          <BaseButton v-if="!showReviewForm" type="primary" @click="showSurvey"
            >Add Review</BaseButton
          >
          <BaseButton v-if="showReviewForm" type="primary" @click="showSurvey">Cancel</BaseButton>
          <BaseButton v-if="allSurveyQuestionsAnswered" type="primary" @click="addReview"
            >Submit Review</BaseButton
          >
        </div>
      </div>

      <!-- comments and form -->
      <div class="comments w-full mt-8">
        <div
          v-for="review in reviews"
          :key="review._id"
          class="flex mb-4 bg-app-blue-soft rounded-lg p-4 shadow shadow-black"
        >
          <div class="rounded-full w-12 h-12 bg-app-blue flex items-center justify-center mr-4">
            <span
              :style="{
                color: videoViewController.getColor(videoViewController.reviewMetric(review))
              }"
              >{{ formatPercentageToRating(videoViewController.reviewMetric(review)) }}</span
            >
          </div>
          <div>
            <div class="text-sm">{{ review.user.name }} - {{ reviewDate(review.createdAt) }}</div>
            <div class="text-white">{{ review.comment }}</div>
          </div>
        </div>
      </div>
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
