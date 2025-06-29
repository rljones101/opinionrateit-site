import { useRoute } from 'vue-router'
import { ref } from 'vue'
import videoViewController from '@/controllers/videoViewController'
import { replaceNewlines, urlify } from '@/utils/StringUtils'

export function useVideoDetails() {
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

  return {
    itemDetail,
    channelId
  }
}
