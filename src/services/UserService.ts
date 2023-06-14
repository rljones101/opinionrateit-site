import { apiGet, apiPost } from '@/utils/AppApi'

const usersLogin = async (email: string, password: string) => {
  return await apiPost('/users/login', { email, password })
}

const getProfile = async (name: string) => {
  return await apiGet(`/profile/${name}`)
}

const usersSignup = async (data: any) => {
  return await apiPost('/users/signup', data)
}

const getReviewerChannel = async (channelId: string) => {
  return await apiGet(`/reviewers/${channelId}`)
}

export { usersLogin, usersSignup, getProfile, getReviewerChannel }
