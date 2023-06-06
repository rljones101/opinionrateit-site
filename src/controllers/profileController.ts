import GoogleAPIService from '@/services/GoogleAPIService'
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { getProfile as userGetProfile } from '@/services/UserService'
import { getMultipleVideos } from '@/utils/googleAPI'
import { apiGet } from '@/utils/AppApi'
import type { VideoChannelDetails } from '@/types'

interface Profile {
  id: string
  name: string
  email: string
  youTubeChannelId: string
  isReviewer: boolean
  publishedVideos: VideoChannelDetails[]
}

const useProfile = () => {
  const googleAPI = new GoogleAPIService()
  const route = useRoute()
  const name = route.params.name as string
  const videos = ref<VideoChannelDetails[]>([])

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
    //const reformattedSearchString = searchParams.split(' ');
    if (profile.value.youTubeChannelId) {
      const query = searchParams.split(' ').join('+')
      videos.value = [
        ...(await googleAPI.getVideosByChannelId(profile.value.youTubeChannelId, query))
      ]
    }
  }

  const getPublishedVideos = async (userId: string) => {
    const res = await apiGet(`/publishedVideos/${userId}`)
    const publishedVideos = [...res.data.data].map((video) => video.videoId)
    return await getMultipleVideos(publishedVideos)
  }

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
          videos.value = [...(await googleAPI.getVideosByChannelId(profile.value.youTubeChannelId))]

          // Get the published videos
          if (profile.value.id) {
            const publishedVideos = await getPublishedVideos(profile.value.id)
            if (publishedVideos) {
              profile.value.publishedVideos = publishedVideos
            }
          }
        }
      }
    }
  })

  return { profile, profileInitials, videos, searchVideos, getPublishedVideos }
}

export { useProfile }
