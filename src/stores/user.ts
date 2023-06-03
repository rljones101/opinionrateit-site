import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usersLogin } from '@/services/UserService'

export const useUserStore = defineStore('user', () => {
  const jwtToken = ref()
  const isLoggedIn = ref(false)
  const user = ref({})
  const saveToken = (token: string) => {
    localStorage.setItem('jwt', token)
    jwtToken.value = token
  }

  const getToken = () => {
    // 1) Check if the token is set
    if (!jwtToken.value) {
      jwtToken.value = localStorage.getItem('jwt')
    }
    return jwtToken.value
  }

  const loginUser = async (email: string, password: string) => {
    const res = await usersLogin(email, password)
    if (res.status === 'success') {
      saveToken(res.originalData.token)
      isLoggedIn.value = true
      if ('data' in res) {
        user.value = res.data.user
      }
    }
    return res
  }

  return { jwtToken, saveToken, getToken, loginUser, isLoggedIn, user }
})
