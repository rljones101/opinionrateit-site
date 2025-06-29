import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/userStore'

const ApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`
})

ApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { getToken } = useUserStore()
    const jwtToken = getToken()

    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

ApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.data) {
      response.data = response.data.data
    }
    return response
  },
  function (error: AxiosError) {
    return Promise.reject(error)
  }
)

export default ApiClient
