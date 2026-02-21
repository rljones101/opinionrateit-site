import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { computed, ref } from 'vue'
import { type AccountDetails, SIGNUP_STEPS, type SignupPlan } from '@/types'
import signupViewController from '@/controllers/signupViewController'
import { createCustomer } from '@/services/stripeService'
import reviewerController from '@/controllers/reviewerController'
import GoogleAPIService from '@/services/GoogleAPIService'

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

        // Only create Stripe customer if the selected plan requires billing
        if (selectedPlan.value.requiresBilling) {
          console.log('Creating Stripe customer...')
          const res = await createCustomer({ email: formData.email, name: fullName })
          console.log('Stripe customer response:', res)

          // Backend returns: { status: 'success', data: { customer: {...} } }
          if (res.data && res.data.customer) {
            billingFormData.value.id = res.data.customer.id
            billingFormData.value.name = fullName
            billingFormData.value.email = accountFormData.value.email.trim()
            console.log('✅ Stripe customer created:', billingFormData.value.id)
          } else {
            throw new Error('Unable to create billing account. Please try again.')
          }
        } else {
          // Free tier: skip Stripe customer creation
          console.log('✅ Free tier selected - skipping Stripe customer creation')
          billingFormData.value.name = fullName
          billingFormData.value.email = accountFormData.value.email.trim()
        }
      } catch (error: any) {
        console.error('❌ Failed to create Stripe customer:', error)
        
        // Enhance error message with tier-specific context
        let errorMessage = 'An error occurred while setting up your account.'
        
        if (error?.response?.data?.message) {
          // Backend API error
          errorMessage = error.response.data.message
        } else if (error?.message) {
          // Standard Error object
          errorMessage = error.message
        } else if (typeof error === 'string') {
          // String error
          errorMessage = error
        }
        
        // Add tier-specific context if it's a billing-related error
        if (selectedPlan.value.requiresBilling && 
            (errorMessage.includes('Stripe') || errorMessage.includes('customer'))) {
          errorMessage = `Failed to create billing account for ${selectedPlan.value.name} tier. ${errorMessage}`
        }
        
        // Create a new error with enhanced message
        const enhancedError = new Error(errorMessage)
        if (error?.response) {
          (enhancedError as any).response = error.response
        }
        
        throw enhancedError
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
    
    // Validate step exists in current plan's steps
    if (stepIndex === -1) {
      console.warn(`Step "${step}" not found in ${selectedPlan.value.name} tier steps`)
      return ''
    }
    
    // Ensure we don't go past the last step
    if (stepIndex < selectedPlan.value.steps.length - 1) {
      const nextStep = selectedPlan.value.steps[stepIndex + 1]
      
      // Additional validation: prevent accessing billing step for Free tier
      if (nextStep === SIGNUP_STEPS.BILLING && !selectedPlan.value.requiresBilling) {
        console.warn('Billing step not available for Free tier')
        return ''
      }
      
      // Additional validation: ensure YouTube step for Creator tier
      if (nextStep === SIGNUP_STEPS.ADD_YOUTUBE_ACCOUNT && !selectedPlan.value.requiresYouTube) {
        console.warn('YouTube step not required for this tier')
        return ''
      }
      
      return nextStep
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
    
    // Validate current step exists in plan's steps
    if (stepIndex === -1) {
      console.warn(`Current step "${currentStep.value}" not found in ${selectedPlan.value.name} tier steps`)
      return
    }
    
    if (stepIndex > 0) {
      const previousStep = selectedPlan.value.steps[stepIndex - 1]
      
      // Additional validation: prevent going back to billing step for Free tier
      if (previousStep === SIGNUP_STEPS.BILLING && !selectedPlan.value.requiresBilling) {
        console.warn('Cannot navigate to billing step for Free tier')
        // Skip to the step before billing
        if (stepIndex > 1) {
          currentStep.value = selectedPlan.value.steps[stepIndex - 2]
        }
        return
      }
      
      // Additional validation: prevent going back to YouTube step for non-Creator tiers
      if (previousStep === SIGNUP_STEPS.ADD_YOUTUBE_ACCOUNT && !selectedPlan.value.requiresYouTube) {
        console.warn('Cannot navigate to YouTube step for this tier')
        // Skip to the step before YouTube
        if (stepIndex > 1) {
          currentStep.value = selectedPlan.value.steps[stepIndex - 2]
        }
        return
      }
      
      currentStep.value = previousStep
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
      const googleApiChannel = await GoogleAPIService.getChannelDetails(channelId)
      if (!googleApiChannel) throw new Error('Failed to get channel details.')
      //loadedYouTubeData.value = true
      // TODO lookup the channel in the existing reviewer data. Do not allow duplicates
      const snippet = googleApiChannel.snippet
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
