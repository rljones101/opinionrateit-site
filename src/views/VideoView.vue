<script setup lang="ts">
import { computed, ref } from 'vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import videoViewController from '@/controllers/videoViewController'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoId = route.params.videoId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='
const reviews = ref([])

const itemDetail = ref({
  title: 'title',
  creator: 'Joe blow',
  description: 'This is the description',
  price: '$99.99',
  social: [],
  youTubeId: videoId,
  youtubeURL: `${youTubeBaseUrl}${videoId}`
})

const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, function (url) {
    return (
      '<a href="' +
      url +
      '" class="text-orange-500 hover:underline" target="_blank">' +
      url +
      '</a>'
    )
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const replaceNewlines = (text) => {
  const urlRegex = /(\n+)/g
  return text.replace(urlRegex, '<br/>')
}

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
  console.log(reviews.value.length)
})

const userProfile = computed(() => {
  return '/profile/' + itemDetail.value.creator
})
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pl-8 pr-8">
    <div class="product-buttons">
      <div class="mb-8">
        <a href="" class="text-orange-500 hover:underline">Reviewers</a> /
        <a href="" class="text-orange-500 hover:underline">{{ itemDetail.creator }}</a> /
        {{ itemDetail.title }}
        review
      </div>
      <!--      <div><button class="item-buy-button md-primary md-raised" v-on:click="purchaseProduct" v-if="itemDetail.buyUrl">BUY</button></div>-->
    </div>
    <div class="border border-slate-700 p-8 rounded">
      <div class="flex flex-row gap-4">
        <div class="flex-1">
          <div class="mb-8">
            <h3 class="font-bold text-white uppercase">{{ itemDetail.title }}</h3>
            <p class="text-sm" v-if="itemDetail.creator">
              Review by: <router-link :to="userProfile">{{ itemDetail.creator }}</router-link>
            </p>
            <!--            <p class="item-price" v-if="itemDetail.price">${{ itemDetail.price }}</p>-->
          </div>
          <div
            class="overflow-y-auto max-h-72 scrollbar scrollbar-thumb-orange-500 scrollbar-track-slate-700"
          >
            <div class="text-sm" v-html="itemDetail.description"></div>
          </div>
          <div class="follow-reviewer" v-if="itemDetail.social && itemDetail.social.length">
            Support Reviewer:
            <div style="display: flex; flex-direction: row; margin: 20px 0">
              <div v-for="(socialItem, i) in itemDetail.social" :key="i">
                <a class="Link SocialLinks-link" :href="socialItem.url" target="_blank">
                  <span>
                    <svg
                      class="Icon-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 64 64"
                      focusable="false"
                    >
                      <use
                        xlink:href="../assets/img/icons/social-icons.svg#social-facebook"
                        v-if="socialItem.type === 'facebook'"
                      ></use>
                      <use
                        xlink:href="../assets/img/icons/social-icons.svg#social-twitter"
                        v-if="socialItem.type === 'twitter'"
                      ></use>
                      <use
                        xlink:href="../assets/img/icons/social-icons.svg#social-youtube"
                        v-if="socialItem.type === 'youtube'"
                      ></use>
                      <use
                        xlink:href="../assets/img/icons/social-icons.svg#social-instagram"
                        v-if="socialItem.type === 'instagram'"
                      ></use>
                      <use
                        xlink:href="../assets/img/icons/social-icons.svg#social-patreon"
                        v-if="socialItem.type === 'patreon'"
                      ></use>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full" v-if="itemDetail && itemDetail.youTubeId">
          <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
        </div>
      </div>
    </div>
    <div class="border border-slate-700 mt-8 p-8 pb-0">
      <div v-for="review in reviews" :key="review._id" class="flex mb-8">
        <div class="rounded-full w-12 h-12 bg-slate-700 flex items-center justify-center mr-4">
          RJ
        </div>
        <div>
          <div class="text-sm">@{{ review.user.name }}</div>
          <div class="text-white">{{ review.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
