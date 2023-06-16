import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const AboutView = () => import('@/views/AboutView.vue')
const ReviewersView = () => import('@/views/ReviewersView.vue')
const ContactView = () => import('@/views/ContactView.vue')
const ReviewerProfile = () => import('@/views/ReviewerProfile.vue')
const SignupView = () => import('@/views/SignupView.vue')
const ReviewerVideos = () => import('@/views/ReviewerVideos.vue')

const VideoView = () => import('@/views/VideoView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
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
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/profile/:name',
      name: 'profile-name',
      component: ReviewerProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
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
