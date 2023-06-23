<script setup lang="ts">
import { ref } from 'vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import videoViewController from '@/controllers/videoViewController'
import { useRoute } from 'vue-router'
import type { Review } from '@/types'
import { reviewDate } from '@/utils/DateUtils'
import { replaceNewlines, urlify } from '@/utils/StringUtils'
import BaseButton from '@/components/buttons/BaseButton.vue'
import MetricInput from '@/components/MetricInput.vue'
import FormContainer from '@/components/containers/FormContainer.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const user = useUserStore()
const videoId = route.params.videoId as string
const channelId = route.params.channelId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='
const reviews = ref<Review[]>([])
const showReviewForm = ref(false)
const reviewQuestions = ref(videoViewController.getReviewQuestions())
console.log('review questions:', reviewQuestions.value)

const itemDetail = ref({
  title: '',
  creator: '',
  description: '',
  price: '',
  social: [],
  youTubeId: videoId,
  youtubeURL: `${youTubeBaseUrl}${videoId}`
})

const reviewForm = ref({
  channelId: route.params.channelId,
  videoId: route.params.videoId,
  overall_presentation: 0,
  clarity: 0,
  product_view: 0,
  product_detail_explanation: 0,
  non_bias: 0,
  average_review_time: 0,
  product_focus: 0,
  provided_resources: 0,
  comment: ''
})

videoViewController.getVideo(videoId).then((res) => {
  if ('items' in res) {
    const snippet = res.items[0].snippet
    itemDetail.value.title = snippet.localized.title
    itemDetail.value.description = replaceNewlines(urlify(snippet.localized.description))
    itemDetail.value.creator = snippet.channelTitle
  }
})

const getReviews = () => {
  videoViewController.getReviewsByVideo(videoId).then((res) => {
    reviews.value = res.data.data
  })
}

const answerQuestion = (question) => {
  const i = reviewQuestions.value.findIndex((q) => {
    if (q.id === question.id) {
      reviewForm.value[question.model.field] = question.model.value
      return true
    }
  })
  if (i > -1) {
    reviewQuestions.value.splice(i, 1)
  }
}

const addReview = async () => {
  try {
    console.log(reviewForm.value)
    await videoViewController.addReview(reviewForm.value)
    // refresh the reviews list
    getReviews()
    // close the form
    showReviewForm.value = false
  } catch (err) {
    console.error(err)
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
      <div class="product-buttons">
        <!--      <div><button class="item-buy-button md-primary md-raised" v-on:click="purchaseProduct" v-if="itemDetail.buyUrl">BUY</button></div>-->
      </div>
      <div class="mb-8 flex justify-end gap-4">
        <BaseButton v-if="user.restrictTo('user')" @click="showReviewForm = !showReviewForm">{{
          !showReviewForm ? 'Add Review' : 'Cancel'
        }}</BaseButton>
        <BaseButton>Bookmark</BaseButton>
      </div>
      <div>
        <Transition name="slide-fade" tag="div" class="absolute">
          <div
            key="videoArea"
            class="relative border border-slate-800 p-8 rounded"
            v-show="!showReviewForm"
          >
            <div class="w-full">
              <div class="md:flex flex-row gap-4">
                <!--        <div class="flex-1">-->
                <!--          <div class="follow-reviewer" v-if="itemDetail.social && itemDetail.social.length">-->
                <!--            Support Reviewer:-->
                <!--            <div style="display: flex; flex-direction: row; margin: 20px 0">-->
                <!--              <div v-for="(socialItem, i) in itemDetail.social" :key="i">-->
                <!--                <a class="Link SocialLinks-link" :href="socialItem.url" target="_blank">-->
                <!--                  <span>-->
                <!--                    <svg-->
                <!--                      class="Icon-svg"-->
                <!--                      xmlns="http://www.w3.org/2000/svg"-->
                <!--                      xmlns:xlink="http://www.w3.org/1999/xlink"-->
                <!--                      viewBox="0 0 64 64"-->
                <!--                      focusable="false"-->
                <!--                    >-->
                <!--                      <use-->
                <!--                        xlink:href="../assets/img/icons/social-icons.svg#social-facebook"-->
                <!--                        v-if="socialItem.type === 'facebook'"-->
                <!--                      ></use>-->
                <!--                      <use-->
                <!--                        xlink:href="../assets/img/icons/social-icons.svg#social-twitter"-->
                <!--                        v-if="socialItem.type === 'twitter'"-->
                <!--                      ></use>-->
                <!--                      <use-->
                <!--                        xlink:href="../assets/img/icons/social-icons.svg#social-youtube"-->
                <!--                        v-if="socialItem.type === 'youtube'"-->
                <!--                      ></use>-->
                <!--                      <use-->
                <!--                        xlink:href="../assets/img/icons/social-icons.svg#social-instagram"-->
                <!--                        v-if="socialItem.type === 'instagram'"-->
                <!--                      ></use>-->
                <!--                      <use-->
                <!--                        xlink:href="../assets/img/icons/social-icons.svg#social-patreon"-->
                <!--                        v-if="socialItem.type === 'patreon'"-->
                <!--                      ></use>-->
                <!--                    </svg>-->
                <!--                  </span>-->
                <!--                </a>-->
                <!--              </div>-->
                <!--            </div>-->
                <!--          </div>-->
                <!--        </div>-->
                <div class="w-full" v-if="itemDetail && itemDetail.youTubeId">
                  <div class="mb-8 rounded bg-app-blue-soft p-8 pt-0">
                    <div class="description">
                      <h3 class="font-bold text-white pt-4 pb-4">Description</h3>
                      <div
                        class="text-sm description-content"
                        v-html="itemDetail.description"
                      ></div>
                    </div>
                  </div>
                  <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
                  <div class="flex justify-between items-center mt-8 mb-8">
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
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div
                v-for="review in reviews"
                :key="review._id"
                class="flex mb-8 bg-app-blue-soft rounded p-4 shadow shadow-black"
              >
                <div
                  class="rounded-full w-12 h-12 bg-app-blue flex items-center justify-center mr-4"
                >
                  <span
                    :style="{
                      color: videoViewController.getColor(videoViewController.reviewMetric(review))
                    }"
                    >{{ videoViewController.reviewMetric(review) }}%</span
                  >
                </div>
                <div>
                  <div class="text-sm">
                    {{ review.user.name }} - {{ reviewDate(review.createdAt) }}
                  </div>
                  <div class="text-white">{{ review.comment }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- comments and form -->
        </Transition>
        <transition name="slide-fade" tag="div" class="absolute">
          <FormContainer class="w-full" key="reviewForm" v-show="showReviewForm">
            <div class="overflow-hidden relative h-80">
              <TransitionGroup name="fade">
                <div v-for="reviewQuestion in reviewQuestions" :key="reviewQuestion.id">
                  <MetricInput
                    v-model="reviewQuestion.model.value"
                    @click:rating="answerQuestion(reviewQuestion)"
                    >{{ reviewQuestion.question }}</MetricInput
                  >
                </div>
                <div :key="10" class="w-full flex flex-col gap-8 h-80">
                  <label for="message" class="block mb-2">Your Comment</label>
                  <textarea
                    id="message"
                    rows="10"
                    v-model="reviewForm.comment"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                  <div>
                    <BaseButton @click="addReview">Submit Review</BaseButton>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </FormContainer>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.description {
  display: block;
}

.description:hover .description-content {
  max-height: 300px;
}

.description-content {
  max-height: 4rem;
  transition: max-height 1s;
  overflow-y: auto;
}
</style>
