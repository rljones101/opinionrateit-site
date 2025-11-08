<script setup lang="ts">
import VideoDescription from '@/views/videoView/partials/VideoDescription.vue'
import MediaPlayer from '@/components/mediaPlayer.vue'
import BookmarkButton from '@/components/bookmarks/BookmarkButton.vue'
import { ref } from 'vue'
import videoViewController from '@/controllers/videoViewController'
import { replaceNewlines, urlify } from '@/utils/StringUtils'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoId = route.params.videoId as string
const channelId = route.params.channelId as string
const youTubeBaseUrl = 'https://www.youtube.com/watch?v='

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
</script>

<template>
  <div class="shadow">
    <div key="videoArea" class="relative bg-secondary-50 p-2 rounded">
      <div class="w-full flex flex-col gap-2" v-if="itemDetail && itemDetail.youTubeId">
        <!-- video player -->
        <MediaPlayer class="media-player" :video-id="itemDetail.youTubeId"></MediaPlayer>
        <div class="flex justify-between items-center gap-2">
          <div>
            <h3 class="font-bold uppercase">{{ itemDetail.title }}</h3>
            <p class="text-sm" v-if="itemDetail.creator">
              Review by:
              <router-link :to="{ name: 'reviewers-channelId-reviews', params: { channelId } }">{{
                itemDetail.creator
              }}</router-link>
            </p>
          </div>
          <BookmarkButton 
            :video-id="videoId" 
            size="lg" 
            variant="with-text"
          />
        </div>
        <!-- description container -->
        <VideoDescription :description="itemDetail.description" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
