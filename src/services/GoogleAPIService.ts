import apiUtils from './ApiUtils';

type VideoChannelDetails = {
  videoId: string,
  title: string,
  description: string,
  creator: string,
  thumbnail: string,
  reviews?: any[]
}

export default class GoogleAPIService {
  getVideosByChannelId(youtubeChannelId: string, query: string = '') {
    const params = {
      part: 'snippet',
      type: 'video',
      order: 'date',
      maxResults: 12,
      q: query || '',
      channelId: youtubeChannelId, // UC3XdYJjWliOdKuZMNaTiP8Q
      prevPageToken: '',
      nextPageToken: '',
    };

    return apiUtils
      .get('search', params)
      .then((response: any) => {
        return response.data.items.map((item: any) => {
          // console.log("Google search:", youtubeChannelId, item);
          return this._videoInterface(item);
        });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  getRating(videoId: string) {
    const params = {
      id: videoId,
    };
    return apiUtils
      .get('getRating', params)
      .then((res: any) => {
        return res.data;
      })
      .catch((error: any) => console.log(error.response.data));
  }

  getChannelDetails(channelId: string) {
    return apiUtils.get('channels', {
      id: channelId,
      part: 'contentDetails, snippet, statistics',
    });
  }

  getVideoDataById(videoId: string) {
    const params = {
      part: 'snippet',
      id: videoId,
    };

    return apiUtils.get('videos', params).then((response: any) => {
      return response.data;
    });
  }

  getVideos() {
    const params = {
      part: 'snippet',
      chart: 'mostPopular',
    };

    return apiUtils.get('videos', params).then((response: any) => {
      return response.data;
    });
  }

  _videoInterface(videoData: any) {
    return {
      videoId: videoData['id']['videoId'],
      title: videoData['snippet']['title'],
      description: videoData['snippet']['description'],
      creator: videoData['snippet']['channelTitle'],
      thumbnail: videoData['snippet']['thumbnails']['medium']['url'],
      reviews: null,
    };
  }
}
