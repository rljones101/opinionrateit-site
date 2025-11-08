import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usersLogin, usersSignup } from '@/services/UserService'

export const useUserStore = defineStore('useUserStore', () => {
  const defaultUserDetails = {
    name: '',
    email: '',
    role: '',
    avatar: '',
    youTubeChannelId: ''
  }

  const isLoggedIn = ref(false)
  const user = ref(defaultUserDetails)

  const saveUser = (userDetails: any) => {
    const { name, email, role, avatar, youTubeChannelId } = userDetails
    // Store non-sensitive user data in localStorage
    localStorage.setItem(
      'orateit-user',
      JSON.stringify({ name, email, role, avatar, youTubeChannelId })
    )
    user.value = userDetails
    isLoggedIn.value = true
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

  const loginUser = async (email: string, password: string) => {
    const res = await usersLogin(email, password)
    if (res.status === 'success') {
      if ('data' in res) {
        saveUser(res.data.user)
      }
    }
    return res
  }

  const signupUser = async (data: any) => {
    const res = await usersSignup(data)
    if (res.status === 'success') {
      if ('data' in res) {
        saveUser(res.data.user)
      }
    }
    return res
  }

  const logoutUser = async () => {
    try {
      // Call logout endpoint to clear httpOnly cookies
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state
      localStorage.removeItem('orateit-user')
      user.value = { ...defaultUserDetails }
      isLoggedIn.value = false
    }
  }

  const checkIfLoggedIn = async () => {
    const userData = getUser()
    if (userData.name) {
      // Try to make an authenticated request to verify the session
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile/${userData.name}`, {
          credentials: 'include'
        })
        isLoggedIn.value = response.ok
      } catch (error) {
        isLoggedIn.value = false
      }
    } else {
      isLoggedIn.value = false
    }
  }

  const restrictTo = (...roles: string[]) => {
    const user = getUser()
    return roles.includes(user.role)
  }

  checkIfLoggedIn()

  return {
    getUser,
    loginUser,
    logoutUser,
    signupUser,
    isLoggedIn,
    user,
    checkIfLoggedIn,
    restrictTo
  }
})
