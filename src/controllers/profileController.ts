import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
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
  const name = route.params.name as string

  // Reactive variables
  const profile: Ref<Profile> = ref({
    id: '',
    name: 'Foo Bar',
    email: 'foobar@company.com',
    youTubeChannelId: '',
    isReviewer: false,
    videos: [],
    publishedVideos: [],
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
    if (profile.value.youTubeChannelId) {
      const res = await userService.getReviewerChannel(channelId)
      console.log(res)
      profile.value.metric = res.data.metric
      profile.value.avgAverageReviewTime = res.data.avgAverageReviewTime
      profile.value.avgClarity = res.data.avgClarity
      profile.value.avgNonBias = res.data.avgNonBias
      profile.value.avgOverallPresentation = res.data.avgOverallPresentation
      profile.value.avgProductDetailExplanation = res.data.avgProductDetailExplanation
      profile.value.avgProductFocus = res.data.avgProductFocus
      profile.value.avgProductView = res.data.avgProductView
      profile.value.avgProvidedResources = res.data.avgProvidedResources
      profile.value.avgShare = res.data.avgShare
    }
  }

  // Init user profile data
  userService.getProfile(name).then(async (res) => {
    // console.log(res)
    if (res.status === 'success') {
      if ('data' in res) {
        const profileData = res.data?.data
        profile.value.id = profileData._id
        profile.value.isReviewer =
          profileData?.role === 'reviewer-basic' || profileData?.role === 'reviewer-plus'
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
  })

  return {
    profile,
    profileInitials,
    searchVideos,
    getVideos,
    publishVideos
  }
}

export { useProfile }
