import axios from 'axios';
import GoogleAPIService from '@/services/GoogleAPIService.ts';

const _productDataInterface = (productData) => {
  return {
    id: productData.id,
    title: productData.title,
    thumbnail: productData.thumbnail,
    youTubeId: productData.youTubeId,
    creator: productData.creator,
    price: productData.price,
    description: productData.description,
    reviews: productData.reviews.map(function (reviewData) {
      return _reviewInterface(reviewData);
    }),
    social: productData.social,
    buyUrl: productData.buyUrl,
  };
};

const _getDefaultProductImage = (videoData, res) => {
  if (videoData) {
    return videoData['items'][0]['snippet']['thumbnails'][res]['url'];
  }
};

const _reviewInterface = (reviewData) => {
  return {
    title: reviewData.title,
    description: reviewData.description,
    author: reviewData.author,
  };
};

class ProductService {
  constructor() {
    this.cachedProducts = [];
  }

  async getProductList() {
    let googleAPIService = new GoogleAPIService();
    const response = await axios.get('videoData.json');
    const products = response.data;
    products.map((product) => _productDataInterface(product));
    await this.asyncForEach(products, async (product) => {
      const videoData = await googleAPIService.getVideoDataById(
        product.youTubeId
      );
      product.thumbnail = _getDefaultProductImage(videoData, 'high');
    });
    this.cachedProducts = products;
    return products;
  }

  async getProductReview(id) {
    if (!this.cachedProducts.length) {
      await this.getProductList();
    }
    return this.cachedProducts.find((review) => {
      return review.id === id;
    });
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
export default new ProductService();
