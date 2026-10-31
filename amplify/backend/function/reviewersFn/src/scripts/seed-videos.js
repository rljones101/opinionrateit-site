/**
 * Seed a reviewer + their published videos into DynamoDB (local or AWS).
 *
 * Usage:
 *   node scripts/seed-videos.js [channelId]
 *
 * Defaults to channel UC3XdYJjWliOdKuZMNaTiP8Q (zReviews) if none is given.
 *
 * It pulls the channel profile and recent uploads from the YouTube Data API
 * using YOUTUBE_API_KEY. If the API is unavailable or the key is rejected,
 * it falls back to a small static sample so the public video browser still
 * has content to show.
 *
 * Requires DynamoDB tables to exist first (npm run dynamo:setup) and, for
 * local runs, DynamoDB Local to be running (npm run dynamo:start).
 */

const loadEnvConfig = require('../utils/loadEnvConfig.js')
loadEnvConfig(process.env.NODE_ENV || 'development')

const axios = require('axios')
const ReviewerService = require('../services/dynamodb/ReviewerService.js')
const PublishedVideoService = require('../services/dynamodb/PublishedVideoService.js')
const ReviewService = require('../services/dynamodb/ReviewService.js')

const DEFAULT_CHANNEL_ID = 'UC3XdYJjWliOdKuZMNaTiP8Q'
const YT_BASE = process.env.YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3/'
const MAX_VIDEOS = 12

const yt = axios.create({ baseURL: YT_BASE, timeout: 10000 })

async function ytGet(path, params) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY is not set')
  const url = `${path}?${new URLSearchParams(params).toString()}&key=${apiKey}`
  const res = await yt.get(url)
  return res.data
}

/**
 * Fetch channel profile (name, avatar, description) from the API.
 */
async function fetchChannelProfile(channelId) {
  const data = await ytGet('channels', { part: 'snippet,statistics', id: channelId })
  const item = data.items && data.items[0]
  if (!item) throw new Error(`Channel not found: ${channelId}`)
  const snippet = item.snippet
  return {
    channelId,
    name: snippet.title,
    description: snippet.description,
    avatar: snippet.thumbnails?.default?.url || '',
    thumbnailMedium: snippet.thumbnails?.medium?.url || '',
    views: Number(item.statistics?.viewCount || 0)
  }
}

/**
 * Fetch recent videos for a channel from the API.
 */
async function fetchChannelVideos(channelId) {
  const data = await ytGet('search', {
    part: 'snippet',
    type: 'video',
    order: 'date',
    maxResults: MAX_VIDEOS,
    channelId
  })
  return (data.items || [])
    .filter((it) => it.id && it.id.videoId)
    .map((it) => ({
      videoId: it.id.videoId,
      channelId,
      title: it.snippet.title,
      thumbnail: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url || ''
    }))
}

/**
 * Static fallback used when the YouTube API can't be reached.
 */
function staticFallback(channelId) {
  const reviewer = {
    channelId,
    name: 'zReviews',
    description: 'Tech product reviews and first impressions.',
    avatar: 'https://yt3.googleusercontent.com/ytc/default-avatar.jpg',
    thumbnailMedium: '',
    views: 0
  }
  const sampleTitles = [
    'Sony WH-1000XM6 Review: Still King?',
    'Tech Talk Live: AI in 2024',
    'The Future of EVs',
    'Gaming Unboxed: RTX 5090',
    'Productivity Hacks for Your Desk Setup',
    'Kyoto Street Food Tour'
  ]
  const videos = sampleTitles.map((title, i) => ({
    videoId: `sample-${channelId}-${i + 1}`,
    channelId,
    title,
    thumbnail: `https://picsum.photos/seed/${channelId}-${i}/320/180`
  }))
  return { reviewer, videos }
}

/**
 * Sample reviews (comments) to attach to seeded videos, so logged-out
 * visitors land on a page with real-looking discussion. Each reviewer here is
 * a denormalised demo "user" (no real account) — just enough for the UI to
 * render an author name and a rating.
 */
const SAMPLE_REVIEWS = [
  {
    user: { userId: 'seed-user-1', name: 'Alex T.' },
    comment: 'Honestly one of the clearest breakdowns I have seen. The audio section sold me.',
    clarity: 92, product_view: 85, product_detail_explanation: 88, non_bias: 80,
    average_review_time: 75, product_focus: 90, provided_resources: 70, overall_presentation: 88
  },
  {
    user: { userId: 'seed-user-2', name: 'Priya K.' },
    comment: 'Good review but I wish there was more on battery life. Still, very helpful before I buy.',
    clarity: 78, product_view: 82, product_detail_explanation: 70, non_bias: 85,
    average_review_time: 68, product_focus: 72, provided_resources: 60, overall_presentation: 75
  },
  {
    user: { userId: 'seed-user-3', name: 'Marcus W.' },
    comment: 'Agree with the rating. Bought it based on this and have zero regrets.',
    clarity: 88, product_view: 90, product_detail_explanation: 84, non_bias: 78,
    average_review_time: 80, product_focus: 86, provided_resources: 75, overall_presentation: 90
  },
  {
    user: { userId: 'seed-user-4', name: 'Dana R.' },
    comment: 'Solid, unbiased take. The comparison footage really helped me decide.',
    clarity: 84, product_view: 80, product_detail_explanation: 82, non_bias: 92,
    average_review_time: 72, product_focus: 79, provided_resources: 68, overall_presentation: 83
  }
]

/**
 * Attach a couple of sample reviews to the first few videos.
 */
async function seedReviews(reviewService, channelId, videos) {
  const videosToReview = videos.slice(0, 3) // first 3 videos get comments
  let total = 0
  for (const video of videosToReview) {
    // Give each video 1–3 reviews from the sample pool.
    const count = 1 + (total % 3)
    for (let i = 0; i < count && i < SAMPLE_REVIEWS.length; i++) {
      const sample = SAMPLE_REVIEWS[(total + i) % SAMPLE_REVIEWS.length]
      await reviewService.createReview({
        videoId: video.videoId,
        channelId,
        ...sample
      })
      total++
    }
  }
  return total
}

async function resolveSeedData(channelId) {
  try {
    console.log('📡 Fetching channel + videos from the YouTube Data API...')
    const [reviewer, videos] = await Promise.all([
      fetchChannelProfile(channelId),
      fetchChannelVideos(channelId)
    ])
    if (!videos.length) throw new Error('API returned no videos')
    console.log(`✅ Fetched "${reviewer.name}" with ${videos.length} videos from YouTube`)
    return { reviewer, videos }
  } catch (err) {
    console.warn(`⚠️  YouTube API unavailable (${err.message}). Using static sample data.`)
    return staticFallback(channelId)
  }
}

async function seed() {
  const channelId = process.argv[2] || DEFAULT_CHANNEL_ID
  console.log(`🌱 Seeding reviewer + videos for channel: ${channelId}`)

  const reviewerService = new ReviewerService()
  const videoService = new PublishedVideoService()
  const reviewService = new ReviewService()

  const { reviewer, videos } = await resolveSeedData(channelId)

  // 1) Upsert the reviewer profile.
  const savedReviewer = await reviewerService.createReviewer(reviewer)
  console.log(`✅ Reviewer saved: ${savedReviewer.name} (${savedReviewer.channelId})`)

  // 2) Insert the videos.
  const savedVideos = await videoService.createMany(videos)
  console.log(`✅ ${savedVideos.length} videos saved`)

  // 3) Keep the denormalised video count in sync.
  await reviewerService.setVideoCount(channelId, savedVideos.length)
  console.log(`✅ Updated numPublishedVideos = ${savedVideos.length}`)

  // 4) Seed sample reviews (comments) on the first few videos so logged-out
  //    visitors see discussion and are nudged to sign in to contribute.
  const reviewCount = await seedReviews(reviewService, channelId, savedVideos)
  console.log(`✅ ${reviewCount} sample reviews saved across ${Math.min(3, savedVideos.length)} videos`)

  console.log('🎉 Seed complete!')
}

if (require.main === module) {
  seed().catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
}

module.exports = { seed }
