import type { KeyOfReviewFormValues, ReviewFormValues, SurveyQuestion } from '@/types'
import { computed, ref } from 'vue'
import videoViewController from '@/controllers/videoViewController'
import { useRoute } from 'vue-router'
import { useReviews } from './useReviews'

export function useSurvey() {
  const route = useRoute()
  const { getReviews } = useReviews()

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
    return (reviewForm.value[key] = value)
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
