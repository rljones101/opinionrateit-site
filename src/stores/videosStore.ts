import { defineStore } from 'pinia'
import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue'
import type { Profile, PublishedVideo, VideoChannelDetails } from '@/types'
import VideoService from '@/services/VideoService'

const isEmpty = (value: string | undefined) => {
  return value === undefined || value === null || value === ''
}

export const useVideosStore = defineStore('useVideosStore', () => {
  const status = ref('idle')
  const videos = ref<VideoChannelDetails[]>([])
  const publishedVideos = ref<VideoChannelDetails[]>([])
  const profile = ref<Profile | undefined>(undefined)

  const getNonPublishedVideos = computed(() => {
    return videos.value.filter((video: VideoChannelDetails) => !isVideoPublished(video))
  })

  const getPublishedVideos = computed(() => publishedVideos.value || [])

  const getSelectedVideos = computed(() => videos.value.filter((video) => video.selected))

  const isVideoPublished = (video: VideoChannelDetails) => {
    // NOTE: we need to call the method to get published videos first so that profile.value.publishedVideos has a value
    return publishedVideos.value.find((publishVideo) => {
      return publishVideo.videoId === video.videoId
    })
  }

  const searchVideos = async (searchParams: string) => {
    if (!profile.value?.youTubeChannelId) return
    status.value = 'searching'
    videos.value = [
      ...(await VideoService.searchVideosByChannel(profile.value?.youTubeChannelId, searchParams))
    ].filter((ytVid: any) => !isVideoPublished(ytVid))
    status.value = 'idle'
  }

  const publishVideos = async () => {
    const videos: PublishedVideo[] = []
    getSelectedVideos.value.forEach((video: VideoChannelDetails) => {
      const publishedVideo: PublishedVideo = {
        videoId: video.videoId,
        user: {
          _id: profile.value?.id ?? '',
          name: profile.value?.name ?? '',
          email: profile.value?.email ?? ''
        },
        title: video.title,
        active: true,
        channelId: profile.value?.youTubeChannelId ?? '',
        thumbnail: video.thumbnail
      }

      videos.push(publishedVideo)
    })

    // 1) Set videos to be published
    await VideoService.publishVideos(videos)
    // 2) Update profile
    await update()
  }

  const unSelectVideos = () => {
    const selected = videos.value.filter((video) => video.selected)
    selected.forEach((vid) => {
      vid.selected = false
    })
  }

  const updateVideos = async () => {
    if (isEmpty(profile.value?.youTubeChannelId)) throw new Error('YouTubeChannelId is required')
    status.value = 'loading'
    const googleVideos = await VideoService.getVideosByChannelId(
      profile.value?.youTubeChannelId ?? ''
    )
    videos.value = [...googleVideos]
    status.value = 'idle'
  }

  const updatePublishedVideos = async () => {
    if (!profile.value?.youTubeChannelId) throw new Error('YouTubeChannelId is required')
    status.value = 'loading'
    const publishedVids = await VideoService.getPublishedVideos(profile.value?.youTubeChannelId)

    publishedVideos.value = [...publishedVids]
    status.value = 'idle'
  }

  const update = async () => {
    if (!profile.value?.youTubeChannelId) return
    await updateVideos()
    await updatePublishedVideos()
    unSelectVideos()
  }

  const setProfile = async (userProfile: MaybeRefOrGetter<Profile>) => {
    profile.value = toValue(userProfile)
    await update()
  }

  return {
    videos,
    status,
    getNonPublishedVideos,
    getPublishedVideos,
    getSelectedVideos,
    setProfile,
    isVideoPublished,
    searchVideos,
    unSelectVideos,
    updateVideos,
    updatePublishedVideos,
    publishVideos
  }
})
