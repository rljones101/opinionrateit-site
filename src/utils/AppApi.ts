import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { AppApiResponse, AppApiErrorResponse } from '@/types'
import { useUserStore } from '@/stores/user'

const appApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`
})

appApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { getToken } = useUserStore()
  const jwtToken = getToken()

  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`
  }
  return config
})

const apiSuccessResponse = (statusCode: number, data: any): AppApiResponse => {
  return { status: 'success', statusCode, data: data.data, originalData: data }
}

const apiErrorResponse = (
  data: any,
  statusCode = 500,
  message = 'Unknown error has occurred!'
): AppApiErrorResponse => {
  return { status: 'error', statusCode, message, originalData: data }
}

const handleError = (error: AxiosError) => {
  if (error.response) {
    const response: AxiosResponse = error.response
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(response.data)
    // console.log(response.status)
    // console.log(response.headers)
    return apiErrorResponse(response.status, response.data.message)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    //console.log(error.request)
    return apiErrorResponse(error, 500, 'Request was made, but response may of timed out')
  } else {
    // Something happened in setting up the request that triggered an Error
    //console.log('Error', error.message)
    return apiErrorResponse(error, 500, error.message)
  }
  //console.log(error.config)
}

const apiGet = async (url: string, config = {}) => {
  try {
    const res = await appApi.get(url, config)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err as AxiosError
    return handleError(axiosError)
  }
}

const apiPost = async (url: string, data: any, config = {}) => {
  try {
    const res = await appApi.post(url, data, config)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err as AxiosError
    return handleError(axiosError)
  }
}

const apiDelete = async (url: string, config = {}) => {
  try {
    const res = await appApi.delete(url, config)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err as AxiosError
    return handleError(axiosError)
  }
}

const apiPatch = async (url: string, data: any, config = {}) => {
  try {
    const res = await appApi.patch(url, data, config)
    return apiSuccessResponse(res.status, res.data)
  } catch (err) {
    const axiosError = err as AxiosError
    return handleError(axiosError)
  }
}

export { appApi, apiGet, apiPost, apiPatch, apiDelete }
