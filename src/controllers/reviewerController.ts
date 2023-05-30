import GoogleAPIService from '@/services/GoogleAPIService';
import ReviewerService from "@/services/ReviewerService";

const googleApiService = new GoogleAPIService();
const reviewerService = new ReviewerService()

const getReviewers = async (query?:URLSearchParams) => await reviewerService.getReviewers(query)

const getVideos = async (youtubeChannelId: string) => {
  try {
    let videos = [];
    if (youtubeChannelId) {
      videos = await googleApiService.getVideosByChannelId(youtubeChannelId);
      // console.log(videos);
    }
    return videos;
  } catch (err) {
    return new Error(`Could not get videos with id (${youtubeChannelId})`);
  }
};

const getChannelDetails = async (youtubeChannelId: string) => {
  if (!youtubeChannelId) throw new Error('youtubeChannelId was not defined');

  try {
    const response = await googleApiService.getChannelDetails(youtubeChannelId);
    // console.log('response:', response);
    if (response.data && response.data.items.length) {
      return  response.data.items[0]
    }
  } catch (err) {
    throw new Error(
      `Could not get channel details with id (${youtubeChannelId}:)`
    );
  }
};

export default {
  getVideos,
  getChannelDetails,
  getReviewers
};
