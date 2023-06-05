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
      component: ReviewersView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/profile/:name',
      name: 'profile-name',
      component: ReviewerProfile
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    }
  ]
})

export default router
