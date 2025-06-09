import { ref, computed, watch, type MaybeRefOrGetter, toValue } from 'vue'
import type { Ref } from 'vue'
import * as userService from '@/services/UserService'
import type { PublishedVideo, VideoChannelDetails } from '@/types'
import reviewerController from '@/controllers/reviewerController'

interface Profile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
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

const useProfile = (name: MaybeRefOrGetter<string>) => {
  const profileLoaded = ref(false)
  const status = ref('loading')

  // Reactive variables
  const profile: Ref<Profile> = ref({
    id: '',
    name: 'Loading',
    email: '',
    role: '',
    createdAt: '',
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
    return reviewerController.getInitials(profile.value.name)
  })

  const isVideoPublished = (video: VideoChannelDetails) => {
    // NOTE: we need to call the method to get published videos first so that profile.value.publishedVideos has a value
    return profile.value.publishedVideos.find((publishVideo) => {
      return publishVideo.videoId === video.videoId
    })
  }

  const searchVideos = async (searchParams: string) => {
    if (profile.value.youTubeChannelId) {
      status.value = 'searching'
      profile.value.videos = [
        ...(await reviewerController.searchVideos(profile.value.youTubeChannelId, searchParams))
      ].filter((ytVid: any) => !isVideoPublished(ytVid))
      status.value = 'idle'
    }
  }

  const getVideos = async () => {
    if (profile.value.isReviewer) {
      status.value = 'loading'
      const googleVideos: VideoChannelDetails[] = await reviewerController.getVideosByChannelId(
        profile.value.youTubeChannelId
      )
      updateVideos(googleVideos)
      status.value = 'idle'
    }
  }

  const getPublishedVideos = async () => {
    if (profile.value.isReviewer) {
      status.value = 'loading'
      const publishedVideos = await reviewerController.getPublishedVideos(
        profile.value.youTubeChannelId
      )
      updatePublishedVideos(publishedVideos)
      status.value = 'idle'
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
        videoId: video.videoId,
        user: {
          _id: profile.value.id,
          name: profile.value.name,
          email: profile.value.email
        },
        title: video.title,
        active: true,
        channelId: profile.value.youTubeChannelId,
        thumbnail: video.thumbnail
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
          profile.value.role = profileData.role
          profile.value.createdAt = profileData.createdAt
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

  watch(() => toValue(name), setProfile, { immediate: true })

  return {
    profile,
    profileInitials,
    profileLoaded,
    searchVideos,
    getVideos,
    publishVideos,
    status
  }
}

export { useProfile }
