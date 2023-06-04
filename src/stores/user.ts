import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usersLogin } from '@/services/UserService'

export const useUserStore = defineStore('user', () => {
  const jwtToken = ref('')
  const isLoggedIn = ref(false)
  const user = ref({
    name: ''
  })

  const saveUserAndToken = (user: any, token: string) => {
    saveUser(user)
    saveToken(token)
    isLoggedIn.value = true
  }

  const saveUser = (userDetails: any) => {
    const { name, email, role } = userDetails
    localStorage.setItem('orateit-user', JSON.stringify({ name, email, role }))
    user.value = userDetails
  }

  const getUser = () => {
    if (!user.value.name) {
      const userDetails = localStorage.getItem('orateit-user')
      if (userDetails) {
        user.value = JSON.parse(userDetails)
      }
    }
    return user.value
  }

  const saveToken = (token: string) => {
    localStorage.setItem('jwt', token)
    jwtToken.value = token
  }

  const getToken = () => {
    // 1) Check if the token is set
    if (!jwtToken.value) {
      jwtToken.value = localStorage.getItem('jwt') || ''
    }
    return jwtToken.value
  }

  const loginUser = async (email: string, password: string) => {
    const res = await usersLogin(email, password)
    if (res.status === 'success') {
      if ('data' in res) {
        saveUserAndToken(res.data.user, res.originalData.token)
      }
    }
    return res
  }

  const logoutUser = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('orateit-user')
    isLoggedIn.value = false
  }

  const checkIfLoggedIn = () => {
    // 1) Get token
    const token = getToken()
    const user = getUser()
    // 2) if the token has a value
    isLoggedIn.value = !!(token && user.name)
  }

  checkIfLoggedIn()

  return { jwtToken, saveToken, getToken, loginUser, logoutUser, isLoggedIn, user, checkIfLoggedIn }
})
