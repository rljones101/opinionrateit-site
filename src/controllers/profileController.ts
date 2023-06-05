import GoogleAPIService from '@/services/GoogleAPIService'
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { getProfile as userGetProfile } from '@/services/UserService'

const useProfile = () => {
  const googleAPI = new GoogleAPIService()
  const route = useRoute()
  const name = route.params.name as string
  const videos = ref<any>([])
  const profile = ref({
    name: 'Foo Bar',
    email: 'foobar@company.com',
    youTubeChannelId: '',
    isReviewer: false
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

  userGetProfile(name).then(async (res) => {
    // console.log(res)

    if (res.status === 'success') {
      if ('data' in res) {
        const profileData = res.data?.data
        profile.value.isReviewer =
          profileData?.role === 'reviewer-basic' || profileData?.role === 'reviewer-plus'
        profile.value.email = profileData.email ?? ''
        profile.value.name = profileData.name ?? ''
        profile.value.youTubeChannelId = profileData.youTubeChannelId ?? ''

        // Get youtube videos
        if (profile.value.isReviewer) {
          videos.value = [...(await googleAPI.getVideosByChannelId(profile.value.youTubeChannelId))]
        }
      }
    }
  })

  return { profile, profileInitials, videos, searchVideos }
}

export { useProfile }
