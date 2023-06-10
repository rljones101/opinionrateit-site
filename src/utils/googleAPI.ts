import axios from 'axios'
import type { VideoChannelDetails } from '@/types'

const googleAPI = axios.create({
  baseURL: import.meta.env.VITE_G_URL
})

function _videoInterface(videoData: any): VideoChannelDetails {
  return {
    videoId: videoData['id']['videoId'],
    title: videoData['snippet']['title'],
    description: videoData['snippet']['description'],
    creator: videoData['snippet']['channelTitle'],
    thumbnail: videoData['snippet']['thumbnails']['medium']['url'],
    selected: false
  }
}

// const getParams = (url: string) => {
//   let params = new URLSearchParams()
//   if (url.indexOf('?') !== -1) {
//     const urlArr = url.split('?')
//     params = new URLSearchParams(urlArr[1])
//   }
//   return params
// }

const get = async (url: string, config = {}) => {
  let path = url
  if (url.indexOf('?') !== -1) {
    const urlArr = url.split('?')
    path = urlArr[0]
    const params = new URLSearchParams(urlArr[1])
    // Add Youtube API key to the param string
    params.append('key', import.meta.env.VITE_G_API)
    path = `${path}?${params}`
  }

  return await googleAPI.get(path, config)
}

// GET
// videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc%2Cc0KYU2j0TM4%2CeIho2S0ZahI&key=[YOUR_API_KEY]
// HTTP/1.1 Authorization: Bearer [YOUR_ACCESS_TOKEN] Accept: application/json
const getMultipleVideos = async (videoIds: string[]) => {
  const stringOfVideos = `part=snippet&id=${videoIds.join(',')}`
  const params = new URLSearchParams(stringOfVideos).toString()
  return await get(`/videos?${params}`).then((res) => {
    const items: [] = res.data.items
    return items.map((el) => _videoInterface(el))
  })
}

export { googleAPI, getMultipleVideos }
