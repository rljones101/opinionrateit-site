const CacheService = require('../services/cache.service.js')
const catchAsync = require('../utils/catchAsync')
const axios = require('axios')

const apiInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/'
})

const ttl = 60 * 60 // cache for 1 Hour
const cache = new CacheService(ttl)

const get = async (path, params, config) => {
  const apiKey = process.env.YOUTUBE_API_KEY
  let url = `${path}?${new URLSearchParams(params).toString()}&key=${apiKey}`
  console.log('url:', url)
  return await apiInstance.get(url, config)
}

exports.getVideosByChannel = catchAsync(async (req, res) => {
  const query = req.query.search
  const channelId = req.query.channelId

  const key = `getVideosByChannel_${channelId}`

  const videos = await cache.get(key, async () => {
    const params = {
      part: 'snippet',
      type: 'video',
      order: 'date',
      maxResults: 12,
      q: query || '',
      channelId: channelId,
      prevPageToken: '',
      nextPageToken: ''
    }

    let response = await get('search', params)
    return response.data.items.map((item) => _videoInterface(item))
  })

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: {
      data: videos
    }
  })
})

// const getVideosByChannelId = (youTubeChannelId, query = '') => {
//     const params = {
//         part: 'snippet',
//         type: 'video',
//         order: 'date',
//         maxResults: 12,
//         q: query || '',
//         channelId: youTubeChannelId,
//         prevPageToken: '',
//         nextPageToken: ''
//     }
//
//     return get('search', params)
//         .then((response) => {
//             return response.data.items.map((item) => {
//                 return _videoInterface(item)
//             })
//         })
//         .catch((error) => {
//             console.log(error)
//         })
// }

function _videoInterface(videoData) {
  return {
    videoId: videoData['id']['videoId'],
    title: videoData['snippet']['title'],
    description: videoData['snippet']['description'],
    creator: videoData['snippet']['channelTitle'],
    thumbnail: videoData['snippet']['thumbnails']['medium']['url'],
    selected: false
  }
}
