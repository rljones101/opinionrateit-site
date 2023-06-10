import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { getProfile as userGetProfile } from '@/services/UserService'
import type { VideoChannelDetails } from '@/types'
import reviewerController from '@/controllers/reviewerController'

interface Profile {
  id: string
  name: string
  email: string
  youTubeChannelId: string
  isReviewer: boolean
  publishedVideos: VideoChannelDetails[]
}

const useProfile = () => {
  const route = useRoute()
  const name = route.params.name as string
  const videos = ref<VideoChannelDetails[]>([])
  const getPublishedVideos = reviewerController.getPublishedVideos
  const publishVideo = reviewerController.publishVideo
  const getVideosByChannelId = reviewerController.getVideosByChannelId

  const profile: Ref<Profile> = ref({
    id: '',
    name: 'Foo Bar',
    email: 'foobar@company.com',
    youTubeChannelId: '',
    isReviewer: false,
    publishedVideos: []
  })

  const profileInitials = computed(() => {
    const initialsArr: string[] = profile.value.name.split(' ')
    return initialsArr.length > 1
      ? initialsArr[0].charAt(0) + initialsArr[1].charAt(0)
      : initialsArr[0].charAt(0)
  })

  const searchVideos = async (searchParams: string) => {
    if (profile.value.youTubeChannelId) {
      videos.value = [
        ...(await reviewerController.searchVideos(profile.value.youTubeChannelId, searchParams))
      ]
    }
  }

  // Init user profile data
  userGetProfile(name).then(async (res) => {
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

        // Get youtube videos
        if (profile.value.isReviewer) {
          videos.value = [...(await getVideosByChannelId(profile.value.youTubeChannelId))]

          // Get the published videos
          const publishedVideos = await getPublishedVideos(profile.value.id)
          if (publishedVideos) {
            profile.value.publishedVideos = publishedVideos
          }
        }
      }
    }
  })

  return { profile, profileInitials, videos, searchVideos, getPublishedVideos, publishVideo }
}

export { useProfile }
