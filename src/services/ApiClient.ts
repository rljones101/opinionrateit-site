import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const ApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true, // Include cookies in requests
  timeout: 10000 // 10 second timeout
})

ApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
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
