import GoogleAPIService from '@/services/GoogleAPIService'
import ReviewerService from '@/services/ReviewerService'
import { apiGet, apiPost } from '@/utils/AppApi'
import { getMultipleVideos } from '@/utils/googleAPI'

const googleApiService = new GoogleAPIService()
const reviewerService = new ReviewerService()

const getReviewers = async (query?: URLSearchParams) => await reviewerService.getReviewers(query)

const getVideos = async (youtubeChannelId: string) => {
  try {
    let videos = []
    if (youtubeChannelId) {
      videos = await googleApiService.getVideosByChannelId(youtubeChannelId)
      // console.log(videos);
    }
    return videos
  } catch (err) {
    return new Error(`Could not get videos with id (${youtubeChannelId})`)
  }
}

const getChannelDetails = async (youtubeChannelId: string) => {
  if (!youtubeChannelId) throw new Error('youtubeChannelId was not defined')

  try {
    const response = await googleApiService.getChannelDetails(youtubeChannelId)
    if (response.data && response.data.items.length) {
      return response.data.items[0]
    }
  } catch (err) {
    throw new Error(`Could not get channel details with id (${youtubeChannelId}:)`)
  }
}

const getVideosByChannelId = (youTubeChannelId: string) => {
  return googleApiService.getVideosByChannelId(youTubeChannelId)
}

const searchVideos = async (youTubeChannelId: string, searchParams: string) => {
  //const reformattedSearchString = searchParams.split(' ');
  if (youTubeChannelId) {
    const query = searchParams.split(' ').join('+')
    return await googleApiService.getVideosByChannelId(youTubeChannelId, query)
  }
}

const getPublishedVideos = async (userId: string) => {
  const res = await apiGet(`/publishedVideos/${userId}`)
  const publishedVideos = [...res.data.data].map((video) => video.videoId)
  return await getMultipleVideos(publishedVideos)
}

const publishVideo = async (user: string, title: string, videoId: string) => {
  return await apiPost('/publishedVideos', {
    user,
    title,
    videoId
  })
}

export default {
  getVideos,
  getChannelDetails,
  getVideosByChannelId,
  getReviewers,
  getPublishedVideos,
  publishVideo,
  searchVideos
}
