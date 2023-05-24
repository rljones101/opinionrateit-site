import axios from "axios";

const baseUrl = import.meta.env.VITE_G_URL
const apiKey = import.meta.env.VITE_G_API

const config = {
  baseUrl,
  apiKey,
};

class ApiUtils {
  generateQueryParams(entity: any): string {
    if (!entity) {
      throw new Error("[entity] param is not defined");
    }

    let endpoint = "";

    for (const prop in entity) {
      if (entity[prop]) {
        endpoint += prop + "=" + entity[prop] + "&";
      }
    }
    endpoint = endpoint.substr(0, endpoint.length - 1);

    return endpoint;
  }

  get(endpoint: string, params: any) {
    endpoint = config.baseUrl + endpoint + "?key=" + config.apiKey;
    endpoint = params
      ? endpoint + "&" + this.generateQueryParams(params)
      : endpoint;

    return axios.get(endpoint).then((youTubeData) => {
      return youTubeData;
    });
  }
}
export default new ApiUtils();
