import { apiGet, apiPost } from '@/utils/AppApi'
import ApiClient from '@/services/ApiClient'
import type { UserModel } from '@/models/UserModel'

const usersLogin = async (email: string, password: string) => {
  return await apiPost('/users/login', { email, password })
}

const getProfile = async (name: string): Promise<UserModel> => {
  const response = await ApiClient.get<{ status: string; user: UserModel }>(`/profile/${name}`)
  return response.data.user
}

const usersSignup = async (data: any) => {
  return await apiPost('/users/signup', data)
}

// Exchange a Google ID token (credential) for an app session.
const usersGoogleAuth = async (credential: string) => {
  return await apiPost('/users/auth/google', { credential })
}

const getReviewerChannel = async (channelId: string) => {
  return await apiGet(`/reviewers/${channelId}`)
}

export { usersLogin, usersSignup, usersGoogleAuth, getProfile, getReviewerChannel }
