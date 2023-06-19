<script setup lang="ts">
import { computed, ref } from 'vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import videoViewController from '@/controllers/videoViewController'
import { useRoute } from 'vue-router'
import type { Review } from '@/types'
import { reviewDate } from '@/utils/DateUtils'
import { replaceNewlines, urlify } from '@/utils/StringUtils'
import BaseButton from '@/components/buttons/BaseButton.vue'

const route = useRoute()
const videoId = route.params.videoId as string
const channelId = route.params.channelId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='
const reviews = ref<Review[]>([])

const itemDetail = ref({
  title: 'title',
  creator: 'Joe blow',
  description: 'This is the description',
  price: '$99.99',
  social: [],
  youTubeId: videoId,
  youtubeURL: `${youTubeBaseUrl}${videoId}`
})

videoViewController.getVideo(videoId).then((res) => {
  if ('items' in res) {
    const snippet = res.items[0].snippet
    itemDetail.value.title = snippet.localized.title
    itemDetail.value.description = replaceNewlines(urlify(snippet.localized.description))
    itemDetail.value.creator = snippet.channelTitle
  }
})

videoViewController.getReviewsByVideo(videoId).then((res) => {
  reviews.value = res.data.data
})

const userProfile = computed(() => {
  return '/profile/' + itemDetail.value.creator
})
</script>

<template>
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
    <div class="border border-slate-800 p-8 rounded">
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
        <div class="md:flex-1 md:w-full" v-if="itemDetail && itemDetail.youTubeId">
          <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
          <div class="flex justify-between items-center mt-8">
            <div>
              <h3 class="font-bold text-white uppercase">{{ itemDetail.title }}</h3>
              <p class="text-sm" v-if="itemDetail.creator">
                Review by: <router-link :to="userProfile">{{ itemDetail.creator }}</router-link>
              </p>
            </div>
            <BaseButton>Save</BaseButton>
          </div>
          <div class="mt-8 rounded bg-app-blue-soft p-8 pt-0">
            <div class="description">
              <h3 class="font-bold text-white pt-4 pb-4">Description</h3>
              <div class="text-sm description-content" v-html="itemDetail.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 mb-8">
      <div class="mb-8 flex gap-4">
        <BaseButton>Add Review</BaseButton>
      </div>
      <div
        v-for="review in reviews"
        :key="review._id"
        class="flex mb-8 bg-app-blue-soft rounded p-4 shadow shadow-black"
      >
        <div class="rounded-full w-12 h-12 bg-app-blue flex items-center justify-center mr-4">
          <span
            :style="{
              color: videoViewController.getColor(videoViewController.reviewMetric(review))
            }"
            >{{ videoViewController.reviewMetric(review) }}%</span
          >
        </div>
        <div>
          <div class="text-sm">{{ review.user.name }} - {{ reviewDate(review.createdAt) }}</div>
          <div class="text-white">{{ review.comment }}</div>
        </div>
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
