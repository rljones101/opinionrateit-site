import { apiGet } from '@/utils/AppApi'

const getAllPublishedVideos = async (query = {}) => {
  let url = '/publishedVideos'
  if (Object.keys(query).length > 0) {
    url += `/search?${new URLSearchParams(query)}`
  }
  const res = await apiGet(url)
  if (res.originalData.results > 0) {
    return res.data.data
  }
  return []
}

export { getAllPublishedVideos }
