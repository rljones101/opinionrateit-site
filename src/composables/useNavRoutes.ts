import { useRouter } from 'vue-router'
export const useNavRoutes = () => {
  const router = useRouter()

  const goToSignup = async () => {
    await router.push({ name: 'signup' })
  }

  const goToHome = async () => {
    await router.push({ name: 'home' })
  }

  return {
    goToSignup,
    goToHome
  }
}
