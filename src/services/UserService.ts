import { apiGet, apiPost } from '@/utils/AppApi'

const usersLogin = async (email: string, password: string) => {
  return await apiPost('/users/login', { email, password })
}

const getProfile = async (name: string) => {
  return await apiGet(`/profile/${name}`)
}

export { usersLogin, getProfile }
