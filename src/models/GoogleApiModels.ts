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
