import { apiPost } from '@/utils/AppApi'

const usersLogin = async (email: string, password: string) => {
  return await apiPost('/users/login', { email, password })
}

export { usersLogin }
