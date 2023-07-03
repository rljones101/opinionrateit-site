import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const ReviewersView = () => import('@/views/ReviewersView.vue')
const MyProfile = () => import('@/views/MyProfile.vue')
const SignupView = () => import('@/views/SignupView.vue')
const ReviewerVideos = () => import('@/views/ReviewerVideos.vue')
const VideoView = () => import('@/views/VideoView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const UserHomeView = () => import('@/views/UserHomeView.vue')
const VideoListView = () => import('@/views/VideoListView.vue')
const MySavedVideos = () => import('@/views/MySavedReviews.vue')
const MyStats = () => import('@/views/MyStats.vue')
const MyVideos = () => import('@/views/MyVideos.vue')
const SearchView = () => import('@/views/SearchResults.vue')
const SuccessView = () => import('@/views/stripe/SuccessView.vue')
const CancelView = () => import('@/views/stripe/CancelView.vue')

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
      name: 'user-home',
      component: UserHomeView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/videos',
          name: 'videos',
          component: VideoListView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/search',
          name: 'search',
          component: SearchView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/my-saved-reviews',
          name: 'my-saved-reviews',
          component: MySavedVideos,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/reviewers',
          name: 'reviewers',
          component: ReviewersView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/reviewers/:channelId/reviews',
          name: 'reviewers-channelId-reviews',
          component: ReviewerVideos,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/reviewers/:channelId/reviews/:videoId',
          name: 'reviewers-channelId-reviews-videoId',
          component: VideoView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/u/:name/my-stats',
          name: 'my-stats',
          component: MyStats,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/u/:name/profile',
          name: 'my-profile',
          component: MyProfile,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/u/:name/my-videos',
          name: 'my-videos',
          component: MyVideos,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
})

const isAuthenticated = () => {
  return localStorage.getItem('jwt') || ''
}

router.beforeEach((to, from, next) => {
  if (!isAuthenticated() && to?.meta?.requiresAuth) {
    next({ name: 'home' })
  } else if (isAuthenticated() && to.name === 'home') {
    next({ name: 'reviewers' })
  } else {
    next()
  }
})

export default router
