import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import * as userService from '@/services/UserService'
import type { PublishedVideo, VideoChannelDetails } from '@/types'
import reviewerController from '@/controllers/reviewerController'

interface Profile {
  id: string
  name: string
  email: string
  youTubeChannelId: string
  isReviewer: boolean
  videos: VideoChannelDetails[]
  publishedVideos: VideoChannelDetails[]
  numberOfPublishedVideos?: number
  avgAverageReviewTime: number
  avgClarity: number
  avgNonBias: number
  avgOverallPresentation: number
  avgProductDetailExplanation: number
  avgProductFocus: number
  avgProductView: number
  avgProvidedResources: number
  avgShare: number
  metric: number
}

const useProfile = () => {
  const route = useRoute()

  const profileLoaded = ref(false)

  // Reactive variables
  const profile: Ref<Profile> = ref({
    id: '',
    name: 'Loading',
    email: '',
    youTubeChannelId: '',
    isReviewer: false,
    videos: [],
    publishedVideos: [],
    numberOfPublishedVideos: 0,
    avgAverageReviewTime: 0,
    avgClarity: 0,
    avgNonBias: 0,
    avgOverallPresentation: 0,
    avgProductDetailExplanation: 0,
    avgProductFocus: 0,
    avgProductView: 0,
    avgProvidedResources: 0,
    avgShare: 0,
    metric: 0
  })

  // Computed
  const profileInitials = computed(() => {
    const initialsArr: string[] = profile.value.name.split(' ')
    return initialsArr.length > 1
      ? initialsArr[0].charAt(0) + initialsArr[1].charAt(0)
      : initialsArr[0].charAt(0)
  })

  const searchVideos = async (searchParams: string) => {
    if (profile.value.youTubeChannelId) {
      profile.value.videos = [
        ...(await reviewerController.searchVideos(profile.value.youTubeChannelId, searchParams))
      ]
    }
  }

  const isVideoPublished = (video: VideoChannelDetails) => {
    // NOTE: we need to call the method to get published videos first so that profile.value.publishedVideos has a value
    return profile.value.publishedVideos.find((publishVideo) => {
      return publishVideo.videoId === video.videoId
    })
  }

  const getVideos = async () => {
    if (profile.value.isReviewer) {
      const googleVideos: VideoChannelDetails[] = await reviewerController.getVideosByChannelId(
        profile.value.youTubeChannelId
      )
      updateVideos(googleVideos)
    }
  }

  const getPublishedVideos = async () => {
    if (profile.value.isReviewer) {
      const publishedVideos = await reviewerController.getPublishedVideos(profile.value.id)
      updatePublishedVideos(publishedVideos)
    }
  }

  const updatePublishedVideos = (publishedVideos: VideoChannelDetails[]) => {
    if (profile.value.isReviewer && publishedVideos) {
      profile.value.publishedVideos = publishedVideos
    }
  }

  const updateVideos = (googleVideos: VideoChannelDetails[]) => {
    if (profile.value.isReviewer && googleVideos) {
      const inPublishedVideos: VideoChannelDetails[] = googleVideos.filter(
        (video: VideoChannelDetails) => !isVideoPublished(video)
      )
      profile.value.videos = [...inPublishedVideos]
    }
  }

  const hidePublishedVideos = () => {
    if (profile.value.isReviewer) {
      profile.value.videos = [
        ...profile.value.videos.filter((video: VideoChannelDetails) => !isVideoPublished(video))
      ]
    }
  }

  const publishVideos = async (channelId: string, selectedVideos: VideoChannelDetails[]) => {
    const videos: PublishedVideo[] = []
    selectedVideos.forEach((video: VideoChannelDetails) => {
      const publishedVideo: PublishedVideo = {
        user: profile.value.id,
        title: video.title,
        videoId: video.videoId,
        channelId: profile.value.youTubeChannelId
      }
      videos.push(publishedVideo)
    })

    // 1) Set videos to be published
    await reviewerController.publishVideos(videos)
    // 2) Update profile
    await updateProfile()
  }

  const updateProfile = async () => {
    // 1) Get the list of publish videos and update the publishedVideos list
    await getPublishedVideos()
    // 2) hide the video that was published in the current videos list
    hidePublishedVideos()
    // 3) Unselect videos that were selected
    unSelectVideos()
  }

  const unSelectVideos = () => {
    const selected = profile.value.videos.filter((video) => video.selected)
    selected.forEach((vid) => {
      vid.selected = false
    })
  }

  const getReviewerChannel = async (channelId: string) => {
    if (channelId) {
      const metrics = await reviewerController.getReviewerMetrics(channelId)
      profile.value = { ...profile.value, ...metrics }
    }
  }

  const isReviewer = (role: string) => {
    return ['reviewer-basic', 'reviewer-plus'].includes(role)
  }

  const setProfile = async (name: string) => {
    if (name) {
      profileLoaded.value = false
      const res = await userService.getProfile(name)
      if (res.status === 'success') {
        if ('data' in res) {
          const profileData = res.data?.data
          profile.value.id = profileData._id
          profile.value.isReviewer = isReviewer(profileData.role)
          profile.value.email = profileData.email ?? ''
          profile.value.name = profileData.name ?? ''
          profile.value.youTubeChannelId = profileData.youTubeChannelId ?? ''

          await getReviewerChannel(profile.value.youTubeChannelId)

          // Get the published videos
          await getPublishedVideos()

          // Get youtube videos
          await getVideos()
        }
      }
      profileLoaded.value = true
    }
  }

  watch(() => route.params.name as string, setProfile, { immediate: true })

  return {
    profile,
    profileInitials,
    profileLoaded,
    searchVideos,
    getVideos,
    publishVideos
  }
}

export { useProfile }
