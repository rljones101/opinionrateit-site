<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
// Components
import CheckListItem from '@/components/CheckListItem.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import PricingCard from '@/components/cards/PricingCard.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import NoAuthLayout from '@/components/layouts/NoAuthLayout.vue'
// Controllers
import reviewerController from '@/controllers/reviewerController'
import signupViewController from '@/controllers/signupViewController'
// Types
import type { SignupPlan } from '@/types'
// Stores
import { useUserStore } from '@/stores/user'
import AccountForm from '@/components/forms/AccountForm.vue'
import BillingForm from '@/components/forms/BillingForm.vue'

import { createCustomer } from '@/services/stripeService'

const router = useRouter()
const userStore = useUserStore()
const signupPlans: SignupPlan[] = signupViewController.getSignupPlans()

const billingFormData = ref({
  id: '',
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: ''
})

const accountFormData = ref({
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
})
const loadedYouTubeData = ref(false)
// const loading = ref(true)
const currentStep = ref('Choose Plan')

// computed methods
const selectedPlan = computed(() => {
  let plan = signupViewController.defaultPlan
  if (accountFormData.value.role) {
    plan = signupPlans.find((plan) => plan.role === accountFormData.value.role) as SignupPlan
  }
  return plan
})

// methods
const handleSubmitAccount = async (formData: any) => {
  try {
    accountFormData.value = { ...formData }
    const fullName =
      accountFormData.value.firstName.trim() + ' ' + accountFormData.value.lastName.trim()
    const res = await createCustomer({ email: formData.email, name: fullName })
    console.log(res)
    billingFormData.value.id = res.data.data.id
    billingFormData.value.name = fullName
    goToNextStep()
  } catch (err) {
    console.error(err)
  }
}

const paymentComplete = async (formData: any) => {
  // Setting this value serves no purpose
  billingFormData.value = { ...formData }
  console.log('billingFormData:', billingFormData.value)
  console.log('formData:', formData)
  // Signup the user
  await userStore.signupUser({
    ...accountFormData.value,
    name: billingFormData.value.name,
    active: true
  })
  // User should now be signed up
  await complete()
}

async function complete() {
  // login and go to 'videos/home' view
  await router.push({ name: 'videos' })
}

async function getChannelDetails() {
  try {
    const channelId = accountFormData.value.youTubeChannelId
    loadedYouTubeData.value = false
    const res = await reviewerController.getChannelDetails(channelId)
    loadedYouTubeData.value = true
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

function clearYouTubeData() {
  accountFormData.value.youTubeChannelId = ''
  accountFormData.value.title = ''
  accountFormData.value.description = ''
  accountFormData.value.avatar = ''
}

function selectPlan(plan: string) {
  if (plan === 'user') {
    loadedYouTubeData.value = false
    clearYouTubeData()
  }

  // Update 'form' role value
  accountFormData.value.role = plan

  // Get the next step
  currentStep.value = selectedPlan.value.steps[1]
}

function isCurrentStepDone(step: string) {
  const itemIndex = selectedPlan.value.steps.indexOf(step)
  return itemIndex <= selectedPlan.value.steps.indexOf(currentStep.value)
}

function getNextStep(step: string) {
  const stepIndex = selectedPlan.value.steps.indexOf(step)
  if (stepIndex < selectedPlan.value.steps.length) {
    return selectedPlan.value.steps[stepIndex + 1]
  }
  return ''
}

function goToPreviousStep() {
  const stepIndex = selectedPlan.value.steps.indexOf(currentStep.value)
  if (stepIndex > 0) {
    currentStep.value = selectedPlan.value.steps[stepIndex - 1]
  }
}

function goToNextStep() {
  const next = getNextStep(currentStep.value)
  if (next) {
    currentStep.value = next
  }
}
</script>

<template>
  <NoAuthLayout>
    <div class="relative flex-1 flex flex-col items-stretch h-full w-full">
      <!-- Step 1: Pricing Cards -->
      <Transition name="fade">
        <div
          key="PricingCards"
          v-show="currentStep === 'Choose Plan'"
          id="PricingCards"
          class="flex flex-col container mx-auto items-center justify-center space-y-8 lg:space-y-0 lg:flex-row lg:space-x-8 mb-8"
        >
          <PricingCard
            v-for="plan in signupPlans"
            :key="plan.role"
            :plan-name="plan.name"
            :pricing="plan.cost.toString()"
            @selected="selectPlan(plan.role)"
          >
            <template #list>
              <CheckListItem :line-through="false" :is-checked="plan.allowedReviewerAccess"
                >Allowed Reviewer Access</CheckListItem
              >
              <CheckListItem :line-through="false" :is-checked="plan.giveReviewerFeedback"
                >Give Reviewer Feedback</CheckListItem
              >
              <CheckListItem :line-through="false" :is-checked="plan.bookmarkReviewer"
                >Bookmark Reviewers</CheckListItem
              >
              <CheckListItem :line-through="true" :is-checked="plan.addYourReviews"
                >Add Your Reviews</CheckListItem
              >
              <CheckListItem :line-through="true" :is-checked="plan.metricAnalysis"
                >Metric analysis</CheckListItem
              >
              <CheckListItem :line-through="true" :is-checked="plan.patreonSupport"
                >Patreon Support</CheckListItem
              >
              <CheckListItem :line-through="true" :is-checked="plan.vinmeo">Vinmeo</CheckListItem>
              <CheckListItem :line-through="true" :is-checked="plan.twitter">Twitter</CheckListItem>
            </template>
          </PricingCard>
        </div>
      </Transition>

      <div
        v-show="currentStep !== 'Choose Plan'"
        class="flex w-full bg-app-blue-soft p-8 rounded-lg shadow-lg shadow-black"
      >
        <div class="min-w-max w-[254px] step-wrapper pr-8 border-r border-slate-700">
          <div class="flex justify-center">
            <BaseButton @click="goToPreviousStep">Go Back</BaseButton>
          </div>

          <ol class="mt-8 flex flex-col w-full">
            <li
              class="relative flex w-full"
              v-for="(step, index) in selectedPlan.steps"
              :key="step"
            >
              <div
                v-if="index < selectedPlan.steps.length - 1"
                class="bg-gray-500 w-0.5 absolute left-2.5 top-0 bottom-0"
              ></div>
              <div class="flex flex-col mb-8">
                <div
                  class="z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0"
                  :class="[
                    { 'bg-blue-600 dark:bg-app-orange-muted': isCurrentStepDone(step) },
                    { 'bg-gray-200 dark:bg-gray-700': !isCurrentStepDone(step) }
                  ]"
                >
                  <svg
                    v-if="isCurrentStepDone(step)"
                    aria-hidden="true"
                    class="w-4 h-4 text-blue-100 dark:text-blue-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    v-if="!isCurrentStepDone(step)"
                    aria-hidden="true"
                    class="w-3 h-3 text-gray-800 dark:text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <!--              <div-->
                <!--                v-if="index !== selectedPlan.steps.length - 1"-->
                <!--                class="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"-->
                <!--              ></div>-->
              </div>
              <div class="ml-8">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ step }}</h3>
              </div>
            </li>
          </ol>
        </div>
        <TransitionGroup
          class="form-wrapper flex-1 w-full relative flex flex-col items-center"
          name="fade"
          tag="div"
        >
          <div
            key="YoutubeCard"
            v-show="currentStep === 'Add YouTube Account'"
            class="flex justify-center w-full text-center"
          >
            <div id="youTubeChannelDetail" class="flex flex-col max-w-md p-8 mb-8 space-y-6">
              <p>
                Please provide your Youtube Channel ID<br />so we can setup your reviewer account
              </p>
              <div
                class="p-8 flex flex-col items-center border rounded-lg border-slate-700 bg-app-blue"
              >
                <svg
                  class="w-24 h-24 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 14"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19.7 3.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.84c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.84A4.225 4.225 0 0 0 .3 3.038a30.148 30.148 0 0 0-.2 3.206v1.5c.01 1.071.076 2.142.2 3.206.094.712.363 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.15 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965c.124-1.064.19-2.135.2-3.206V6.243a30.672 30.672 0 0 0-.202-3.206ZM8.008 9.59V3.97l5.4 2.819-5.4 2.8Z"
                    clip-rule="evenodd"
                  />
                </svg>
                YouTube Channel ID
              </div>
              <FormInput
                label="YouTube Channel ID"
                name="youTubeChannelId"
                class="text-center"
                v-model="accountFormData.youTubeChannelId"
              />
              <div class="flex gap-4">
                <!--                <BaseButton @click="cancel">Cancel</BaseButton>-->
                <BaseButton class="w-full" :is-primary="true" @click="getChannelDetails"
                  >Get My YouTube Profile</BaseButton
                >
              </div>
            </div>
          </div>

          <!-- user register form -->
          <div key="register" v-if="currentStep === 'Account'" class="w-full px-8">
            <AccountForm :form-data="accountFormData" @submit="handleSubmitAccount" />
          </div>

          <div
            key="UserFormAndBillCards"
            class="w-full flex flex-col gap-8"
            v-show="currentStep === 'Billing'"
          >
            <!-- billing -->
            <div class="flex pl-8 gap-8">
              <BillingForm
                :form-data="billingFormData"
                :selected-plan="selectedPlan"
                @payment-complete="paymentComplete"
              />
              <div class="flex flex-col justify-between p-8 bg-app-blue rounded-lg">
                <div>
                  <h2 class="text-xl mb-8">Order Summary</h2>
                  <div class="flex items-start gap-8">
                    <div class="flex flex-col">
                      <span class="text-app-orange">Reviewer Plan</span><span>Monthly</span>
                    </div>
                    <div class="text-white">${{ selectedPlan.cost }}</div>
                  </div>
                </div>
                <!--            <div class="flex justify-between mt-8 border-t border-app-blue pt-4">-->
                <!--              <span>TOTAL</span><span class="text-white">$4.99</span>-->
                <!--            </div>-->
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </NoAuthLayout>
</template>

<style scoped>
.form-wrapper {
  flex-grow: 1;
  height: 100%;
}

.form-wrapper > * {
  flex: 1;
}
</style>
