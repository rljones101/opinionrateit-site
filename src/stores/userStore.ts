import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usersLogin, usersSignup } from '@/services/UserService'

export const useUserStore = defineStore('useUserStore', () => {
  const defaultUserDetails = {
    id: '',
    name: '',
    email: '',
    role: '',
    avatar: '',
    photo: '',
    youTubeChannelId: '',
    createdAt: '',
    lastLoginAt: '',
    // Extended profile fields
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: ''
  }

  const isLoggedIn = ref(false)
  const user = ref(defaultUserDetails)

  const saveUser = (userDetails: any) => {
    const { 
      _id, 
      id, 
      name, 
      email, 
      role, 
      avatar, 
      photo, 
      youTubeChannelId, 
      createdAt,
      lastLoginAt,
      bio,
      location,
      website,
      twitter,
      linkedin
    } = userDetails
    
    // Normalize user data
    const normalizedUser = {
      id: _id || id || '',
      name: name || '',
      email: email || '',
      role: role || 'user',
      avatar: avatar || photo || '',
      photo: photo || avatar || '',
      youTubeChannelId: youTubeChannelId || '',
      createdAt: createdAt || new Date().toISOString(),
      lastLoginAt: lastLoginAt || new Date().toISOString(),
      bio: bio || '',
      location: location || '',
      website: website || '',
      twitter: twitter || '',
      linkedin: linkedin || ''
    }
    
    // Store non-sensitive user data in localStorage
    localStorage.setItem('orateit-user', JSON.stringify(normalizedUser))
    user.value = normalizedUser
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
          credentials: 'include'
        })
        if (response.ok) {
          isLoggedIn.value = true
          return true
        } else {
          // Session is invalid, clear local storage
          localStorage.removeItem('orateit-user')
          user.value = { ...defaultUserDetails }
          isLoggedIn.value = false
          return false
        }
      } catch (error) {
        // Network error or server down, don't clear state on signup/login pages
        // Just mark as not logged in
        isLoggedIn.value = false
        return false
      }
    } else {
      isLoggedIn.value = false
      return false
    }
  }

  const restrictTo = (...roles: string[]) => {
    const user = getUser()
    return roles.includes(user.role)
  }

  // Profile management methods
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success' && data.data?.user) {
          saveUser(data.data.user)
          return data.data.user
        }
      }
      throw new Error('Failed to fetch user data')
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<typeof defaultUserDetails>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/updateMe`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success' && data.data?.user) {
          saveUser(data.data.user)
          return data.data.user
        }
      }
      throw new Error('Failed to update profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const changePassword = async (passwordData: {
    passwordCurrent: string
    password: string
    passwordConfirm: string
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/updateMyPassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(passwordData)
      })
      
      if (response.ok) {
        const data = await response.json()
        return data
      }
      
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to change password')
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/deleteMe`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Clear local data after successful deletion
        localStorage.removeItem('orateit-user')
        user.value = { ...defaultUserDetails }
        isLoggedIn.value = false
        return true
      }
      throw new Error('Failed to delete account')
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success' && data.data?.avatarUrl) {
          // Update user with new avatar URL
          user.value.avatar = data.data.avatarUrl
          user.value.photo = data.data.avatarUrl
          localStorage.setItem('orateit-user', JSON.stringify(user.value))
          return data.data.avatarUrl
        }
      }
      
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to upload avatar')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  // Computed properties for better API
  const currentUser = user
  const isAuthenticated = isLoggedIn

  // Only check if logged in if there's user data in localStorage
  // This prevents unnecessary API calls on signup/login pages
  const userData = localStorage.getItem('orateit-user')
  if (userData) {
    checkIfLoggedIn()
  }

  return {
    // Original methods
    getUser,
    loginUser,
    logoutUser,
    signupUser,
    isLoggedIn,
    user,
    checkIfLoggedIn,
    restrictTo,
    
    // New profile management methods
    fetchCurrentUser,
    updateProfile,
    changePassword,
    deleteAccount,
    uploadAvatar,
    
    // Computed properties
    currentUser,
    isAuthenticated
  }
})
