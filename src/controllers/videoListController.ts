import { apiGet } from '@/utils/AppApi'
import { getMultipleVideos } from '@/utils/googleAPI'

const getAllPublishedVideos = async (query = {}) => {
  console.log('getAllPublishedVideos')
  let url = '/publishedVideos'
  if (Object.keys(query).length > 0) {
    url += `/search?${new URLSearchParams(query)}`
  }
  const res = await apiGet(url)
  if (res.originalData.results > 0) {
    const channelId = [...res.data.data][0].channelId
    const publishedVideos = [...res.data.data].map((video) => video.videoId)
    const youTubeVideos = await getMultipleVideos(publishedVideos)
    return youTubeVideos.map((video) => ({ ...video, channelId }))
  }
  return []
}

export { getAllPublishedVideos }
