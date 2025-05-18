import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { type AccountDetails, SIGNUP_STEPS, type SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'
import { createCustomer } from '@/services/stripeService'
import reviewerController from '@/controllers/reviewerController'

export const useSignupStore = defineStore('useSignupStore', () => {
  const defaultBillingData = {
    id: '',
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  }

  const defaultAccountData = {
    youTubeChannelId: '',
    title: '',
    description: '',
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: ''
  }

  const userStore = useUserStore()
  const billingFormData = ref(defaultBillingData)
  const accountFormData = ref(defaultAccountData)
  const currentStep = ref<SIGNUP_STEPS>(SIGNUP_STEPS.CHOOSE_PLAN)
  const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()

  // GETTERS
  const selectedPlan = computed<SignupPlan>(() => {
    let plan = signupViewController.defaultPlan
    if (accountFormData.value.role) {
      plan = signupPlans.find((plan) => plan.role === accountFormData.value.role) as SignupPlan
    }
    return plan
  })

  // ACTIONS
  const setAccountData = async (formData: AccountDetails) => {
    try {
      console.log('account form data:', formData)
      accountFormData.value = formData
      const fullName =
        accountFormData.value.firstName.trim() + ' ' + accountFormData.value.lastName.trim()
      const res = await createCustomer({ email: formData.email, name: fullName })
      // console.log(res)
      billingFormData.value.id = res.data.data.id
      billingFormData.value.name = fullName
      billingFormData.value.email = accountFormData.value.email.trim()
    } catch (error: unknown) {
      if (typeof error === 'string') console.log(error)
    }
  }

  const paymentComplete = async (formData: any) => {
    // Setting this value serves no purpose
    billingFormData.value = { ...formData }
    console.log('billingFormData:', billingFormData.value)
    console.log('formData:', formData) // Signup the user
    await userStore.signupUser({
      ...accountFormData.value,
      name: billingFormData.value.name,
      active: true
    })
    // User should now be signed up
    //await complete()
  }

  const clearAccountData = () => {
    accountFormData.value.youTubeChannelId = ''
    accountFormData.value.title = ''
    accountFormData.value.description = ''
    accountFormData.value.avatar = ''
  }

  const selectPlan = (plan: string) => {
    if (plan === 'user') {
      //loadedYouTubeData.value = false
      clearAccountData()
    }

    // Update 'form' role value
    accountFormData.value.role = plan

    // Get the next step
    currentStep.value = selectedPlan.value.steps[1]
  }

  const getNextStep = (step: SIGNUP_STEPS) => {
    const stepIndex = selectedPlan.value.steps.indexOf(step)
    if (stepIndex < selectedPlan.value.steps.length) {
      return selectedPlan.value.steps[stepIndex + 1]
    }
    return ''
  }

  const goToNextStep = () => {
    const next = getNextStep(currentStep.value)
    if (next) {
      currentStep.value = next
    }
  }

  const goToPreviousStep = () => {
    const stepIndex = selectedPlan.value.steps.indexOf(currentStep.value)
    if (stepIndex > 0) {
      currentStep.value = selectedPlan.value.steps[stepIndex - 1]
    }
  }

  const isCurrentStepDone = (step: SIGNUP_STEPS) => {
    const itemIndex = selectedPlan.value.steps.indexOf(step)
    return itemIndex <= selectedPlan.value.steps.indexOf(currentStep.value)
  }

  const getChannelDetails = async () => {
    try {
      const channelId = accountFormData.value.youTubeChannelId
      //loadedYouTubeData.value = false
      const res = await reviewerController.getChannelDetails(channelId)
      //loadedYouTubeData.value = true
      // TODO lookup the channel in the existing reviewer data. Do not allow duplicates
      const snippet = res.snippet
      accountFormData.value.title = snippet.title
      accountFormData.value.avatar = snippet.thumbnails.default.url
      accountFormData.value.description = snippet.description
      goToNextStep()
    } catch (err) {
      console.error(err)
    }
  }

  const reset = () => {
    billingFormData.value = { ...defaultBillingData }
    accountFormData.value = { ...defaultAccountData }
    currentStep.value = SIGNUP_STEPS.CHOOSE_PLAN
  }

  return {
    currentStep,
    billingFormData,
    accountFormData,
    selectedPlan,
    setAccountData,
    selectPlan,
    paymentComplete,
    getNextStep,
    goToNextStep,
    goToPreviousStep,
    isCurrentStepDone,
    getChannelDetails,
    reset
  }
})