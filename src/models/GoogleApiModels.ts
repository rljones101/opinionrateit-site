export type SearchResponse = {
  data: {
    items: SearchResult[]
  }
}

export type SearchResult = {
  kind: 'youtube#searchResult'
  etag: string
  id: {
    kind: string
    videoId: string
    channelId: string
    playlistId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      [key: string]: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    liveBroadcastContent: string
  }
}

type etag = {}

type ChannelSnippet = {
  title: string
  description: string
  customUrl: string
  publishedAt: string
  thumbnails: {
    [key: string]: {
      url: string
      width: number
      height: number
    }
  }
  defaultLanguage: string
  localized: {
    title: string
    description: string
  }
  country: string
}

type ChannelContentDetails = {
  relatedPlaylists: {
    likes: string
    favorites: string
    uploads: string
  }
}

type ChannelStatistics = {
  viewCount: number
  subscriberCount: number // this value is rounded to three significant figures
  hiddenSubscriberCount: boolean
  videoCount: number
}

type ChannelTopics = {
  topicIds: string[]
  topicCategories: string[]
}

type ChannelStatus = {
  privacyStatus: string
  isLinked: boolean
  longUploadsStatus: string
  madeForKids: boolean
  selfDeclaredMadeForKids: boolean
}

type ChannelBrandingStatus = {
  channel: {
    title: string
    description: string
    keywords: string
    trackingAnalyticsAccountId: string
    unsubscribedTrailer: string
    defaultLanguage: string
    country: string
  }
  watch: {
    textColor: string
    backgroundColor: string
    featuredPlaylistId: string
  }
}

type ChannelAuditDetails = {
  overallGoodStanding: boolean
  communityGuidelinesGoodStanding: boolean
  copyrightStrikesGoodStanding: boolean
  contentIdClaimsGoodStanding: boolean
}

type ChannelContentOwnerDetails = {
  contentOwner: string
  timeLinked: string
}

type ChannelLocalizations = {
  [key: string]: {
    title: string
    description: string
  }
}

export interface GoogleApiChannel {
  kind: 'youtube#channel'
  etag: etag
  id: string
  snippet: ChannelSnippet
  contentDetails: ChannelContentDetails
  statistics: ChannelStatistics
  topicDetails: ChannelTopics
  status: ChannelStatus
  brandingSettings: ChannelBrandingStatus
  auditDetails: ChannelAuditDetails
  contentOwnerDetails: ChannelContentOwnerDetails
  localizations: ChannelLocalizations
}

export interface GoogleApiChannelResponse {
  kind: 'youtube#channelListResponse'
  etag: etag
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: GoogleApiChannel[]
}
