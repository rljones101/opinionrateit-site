import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const ReviewersView = () => import('@/views/reviewers/ReviewersView.vue')
const MyProfile = () => import('@/views/myProfile/MyProfile.vue')
const SignupView = () => import('@/views/SignupView/SignupView.vue')
const ReviewerVideos = () => import('@/views/reviewerVideos/ReviewerVideos.vue')
const VideoView = () => import('@/views/videoView/VideoView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const UserHomeView = () => import('@/views/UserHomeView.vue')
const VideoListView = () => import('@/views/VideoListView.vue')
const MySavedVideos = () => import('@/views/mySavedReviews/MySavedReviews.vue')
const MyStats = () => import('@/views/myStats/MyStats.vue')
const MyVideos = () => import('@/views/myVideos/MyVideos.vue')
const MyFavorites = () => import('@/views/myFavorites/MyFavorites.vue')
const MyWatchHistory = () => import('@/views/myWatchHistory/MyWatchHistory.vue')
const SearchView = () => import('@/views/SearchResults.vue')
const SuccessView = () => import('@/views/stripe/SuccessView.vue')
const CancelView = () => import('@/views/stripe/CancelView.vue')
const ProfileView = () => import('../views/ProfileView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/success',
      name: 'signup-success',
      component: SuccessView
    },
    {
      path: '/cancel',
      name: 'signup-cancelled',
      component: CancelView
    },
    {
      path: '/access',
      component: UserHomeView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'user-home',
          redirect: { name: 'videos' }
        },
        {
          path: 'videos',
          name: 'videos',
          component: VideoListView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'search',
          name: 'search',
          component: SearchView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'my-saved-reviews',
          name: 'my-saved-reviews',
          component: MySavedVideos,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: MyFavorites,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'watch-history',
          name: 'watch-history',
          component: MyWatchHistory,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'reviewers',
          name: 'reviewers',
          component: ReviewersView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'reviewers/:channelId/reviews',
          name: 'reviewers-channelId-reviews',
          component: ReviewerVideos,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: 'reviewers/:channelId/reviews/:videoId',
          name: 'reviewers-channelId-reviews-videoId',
          component: VideoView,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: 'u/:name/my-stats',
          name: 'my-stats',
          component: MyStats,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'u/:name/profile',
          name: 'my-profile',
          component: MyProfile,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'u/:name/my-videos',
          name: 'my-videos',
          component: MyVideos,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
})

const isAuthenticated = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
      credentials: 'include'
    })
    return response.ok
  } catch (error) {
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  // Skip authentication check for public routes
  const publicRoutes = ['home', 'login', 'signup', 'signup-success', 'signup-cancelled']
  const isPublicRoute = publicRoutes.includes(to.name as string)
  
  // Only check authentication if the route requires it or if we're not on a public route
  if (to?.meta?.requiresAuth || !isPublicRoute) {
    const authenticated = await isAuthenticated()

    if (!authenticated && to?.meta?.requiresAuth) {
      // Clear user store when session is invalid
      const { useUserStore } = await import('@/stores/userStore')
      const userStore = useUserStore()
      if (userStore.isLoggedIn) {
        localStorage.removeItem('orateit-user')
        userStore.isLoggedIn = false
        userStore.user = {
          id: '',
          name: '',
          email: '',
          role: '',
          avatar: '',
          photo: '',
          youTubeChannelId: '',
          createdAt: '',
          lastLoginAt: '',
          bio: '',
          location: '',
          website: '',
          twitter: '',
          linkedin: ''
        }
      }
      next({ name: 'home' })
    } else if (authenticated && to.name === 'home') {
      next({ name: 'reviewers' })
    } else {
      next()
    }
  } else {
    // Public route, no authentication check needed
    next()
  }
})

export default router
