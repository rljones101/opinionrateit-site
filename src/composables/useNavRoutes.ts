import { useRouter } from 'vue-router'
export const useNavRoutes = () => {
  const router = useRouter()

  // Optionally pre-select a plan tier via ?plan=<role> so the signup flow
  // starts on the right step (and the link is shareable/bookmarkable).
  const goToSignup = async (plan?: string) => {
    await router.push({ name: 'signup', query: plan ? { plan } : {} })
  }

  const goToHome = async () => {
    await router.push({ name: 'home' })
  }

  const goToVideos = async () => {
    await router.push({ name: 'videos' })
  }

  return {
    goToSignup,
    goToHome,
    goToVideos
  }
}
