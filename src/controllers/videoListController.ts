import { apiGet } from '@/utils/AppApi'
import { getMultipleVideos } from '@/utils/googleAPI'

const getAllPublishedVideos = async () => {
  const res = await apiGet('/publishedVideos')
  const channelId = [...res.data.data][0].channelId
  const publishedVideos = [...res.data.data].map((video) => video.videoId)
  const youTubeVideos = await getMultipleVideos(publishedVideos)
  return youTubeVideos.map((video) => ({ ...video, channelId }))
}

export { getAllPublishedVideos }
