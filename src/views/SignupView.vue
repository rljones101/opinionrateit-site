<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// Components
import CheckListItem from '@/components/CheckListItem.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import PricingCard from '@/components/cards/PricingCard.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import FormTextarea from '@/components/inputs/FormTextarea.vue'
import NoAuthLayout from '@/components/layouts/NoAuthLayout.vue'
// Controllers
import reviewerController from '@/controllers/reviewerController'
import signupViewController from '@/controllers/signupViewController'
import {
  createCardElement,
  getCardElement,
  createPaymentMethod,
  confirmCardPayment
} from '@/controllers/stripeController'
// Services
import { createPaymentIntent } from '@/services/stripeService'
// Types
import type { BillingDetails } from '@/types'
// Stores
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const signupPlans = signupViewController.getSignupPlans()

const defaultForm = {
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

const checkoutForm = {
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: ''
}

const form = ref(defaultForm)
const loadedYouTubeData = ref(false)
const loading = ref(true)
const currentStep = ref('Choose Plan')

// computed methods
const selectedPlan = computed(() => {
  if (form.value.role) {
    return signupPlans.find((plan) => plan.role === form.value.role)
  }
  return signupViewController.defaultPlan
})

// methods
async function handleSubmitAccount() {
  checkoutForm.name = form.value.firstName.trim() + ' ' + form.value.lastName.trim()
  goToNextStep()
}

async function complete() {
  // login and go to 'videos/home' view
  await router.push({ name: 'videos' })
}

async function getChannelDetails() {
  try {
    const channelId = form.value.youTubeChannelId
    loadedYouTubeData.value = false
    const res = await reviewerController.getChannelDetails(channelId)
    loadedYouTubeData.value = true
    // TODO lookup the channel in the existing reviewer data. Do not allow duplicates
    const snippet = res.snippet
    form.value.title = snippet.title
    form.value.avatar = snippet.thumbnails.default.url
    form.value.description = snippet.description
    goToNextStep()
  } catch (err) {
    console.error(err)
  }
}

function clearYouTubeData() {
  form.value.youTubeChannelId = ''
  form.value.title = ''
  form.value.description = ''
  form.value.avatar = ''
}

function selectPlan(plan: string) {
  if (plan === 'user') {
    loadedYouTubeData.value = false
    clearYouTubeData()
  }
  form.value.role = plan
  // Get the next step
  currentStep.value = selectedPlan.value.steps[1]
}

async function handleSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    // Used to pass to the payment intent and lookup price
    const priceKey = selectedPlan.value.priceKey
    // Get the billing details
    const billingDetails: BillingDetails = {
      name: checkoutForm.name,
      email: form.value.email,
      address: {
        city: checkoutForm.city,
        line1: checkoutForm.address,
        state: checkoutForm.state,
        postal_code: checkoutForm.zip
      }
    }
    // Get the card element that contains the card data
    const cardElement = getCardElement()
    // create a payment intent
    const res = await createPaymentIntent({ priceKey })
    // get the secret
    const secret = res.data.data.secret
    // create the payment method
    const paymentMethodReq = await createPaymentMethod(cardElement, billingDetails)
    // confirm the payment with the secret from the intent
    const { error } = confirmCardPayment(secret, paymentMethodReq.paymentMethod.id)
    // an error occurred while creating a payment
    if (error) {
      console.error(`Failed to make a payment: ${error}`)
      return
    } else {
      // Signup user
      const submittedForm = {
        ...form.value,
        name: checkoutForm.name,
        active: true
      }
      await userStore.signupUser(submittedForm)
    }

    loading.value = false
    // done... go to 'complete' step
    await complete()
  } catch (err) {
    console.error(err)
  }
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
  console.log('step index:', stepIndex)
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

let element = null
// lifecycle hooks
onMounted(() => {
  if (!element) {
    const element = createCardElement()
    element.mount('#stripe-element-mount-point')
  }
  loading.value = false
})
</script>

<template>
  <NoAuthLayout>
    <!-- Step 1: Pricing Cards -->
    <div class="relative flex-1 flex flex-col items-stretch h-full w-full">
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
          <BaseButton @click="goToPreviousStep">Go Back</BaseButton>
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
                id="channelId"
                v-model="form.youTubeChannelId"
                class="text-center"
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
            <form @submit.prevent="handleSubmitAccount" class="flex-1 flex flex-col">
              <div id="Account" class="mb-8 space-y-2">
                <h2 class="font-bold text-xl">Account</h2>
                <!-- YouTube Details -->
                <div v-if="form.youTubeChannelId" class="space-y-2">
                  <div class="flex flex-col items-center text-slate-500">
                    <UserAvatar :src="form.avatar" :name="form.title" />
                    <p>YouTube Channel ID:</p>
                    <p class="text-white">{{ form.youTubeChannelId }}</p>
                  </div>
                  <FormInput
                    id="title"
                    v-model="form.title"
                    type="text"
                    label="YouTube Title"
                    class="flex-1"
                  />

                  <div>
                    <label for="description" class="block mb-2 text-sm font-medium text-slate-300"
                      >YouTube Description</label
                    >
                    <FormTextarea
                      id="description"
                      rows="5"
                      v-model.trim="form.description"
                      placeholder="Write your description here..."
                    />
                  </div>
                </div>
                <!-- user name, email and password -->
                <div class="flex flex-col md:flex-row flex-auto md:gap-6 w-full">
                  <input type="hidden" v-model="form.role" />
                  <FormInput
                    id="firstname"
                    v-model="form.firstName"
                    type="text"
                    label="First Name"
                    class="flex-1"
                  />
                  <FormInput
                    id="lastname"
                    v-model="form.lastName"
                    type="text"
                    label="Last Name"
                    class="flex-1"
                  />
                </div>
                <FormInput
                  id="email"
                  label="Email"
                  v-model="form.email"
                  placeholder="johndoe@example.com"
                />
                <FormInput
                  id="password"
                  v-model="form.password"
                  type="password"
                  label="Your password"
                  required
                />
                <FormInput
                  id="password-repeat"
                  v-model="form.passwordConfirm"
                  type="password"
                  label="Repeat password"
                  required
                />
              </div>
              <div class="form-controls">
                <BaseButton class="max-w-fit" type="submit" :is-primary="true">
                  {{ loading ? 'loading...' : 'Continue' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <div
            key="UserFormAndBillCards"
            class="w-full flex flex-col gap-8"
            v-show="currentStep === 'Billing'"
          >
            <!-- billing -->
            <div class="flex pl-8 gap-8">
              <form @submit.prevent="handleSubmit" class="flex-1 flex flex-col">
                <div id="Billing" class="space-y-2">
                  <h2 class="font-bold text-xl">Billing</h2>
                  <!-- Add a hidden field with the lookup_key of your Price -->
                  <input type="hidden" name="priceKey" v-model="selectedPlan.priceKey" />
                  <input type="hidden" name="email" v-model="form.email" />
                  <FormInput
                    id="name"
                    label="Name"
                    v-model="checkoutForm.name"
                    placeholder="Your Name"
                  />
                  <FormInput
                    id="address"
                    label="Address"
                    v-model="checkoutForm.address"
                    placeholder="Your street address"
                    ><template #errorMessage> Address is incomplete. </template></FormInput
                  >
                  <FormInput
                    id="city"
                    label="City"
                    v-model="checkoutForm.city"
                    placeholder="Your City"
                  />
                  <div class="flex gap-4">
                    <FormInput
                      id="state"
                      label="State"
                      v-model="checkoutForm.state"
                      placeholder="Your State"
                    />
                    <FormInput
                      id="zip"
                      label="Zip"
                      v-model="checkoutForm.zip"
                      placeholder="Your Zip"
                    />
                  </div>
                  <label>Credit Card Information</label>
                  <div
                    id="stripe-element-mount-point"
                    class="bg-app-blue rounded-lg text-white p-2.5"
                  ></div>
                </div>
                <div class="form-controls mt-6">
                  <BaseButton
                    id="checkout-and-portal-button"
                    class="max-w-fit"
                    type="submit"
                    :is-primary="true"
                  >
                    {{ loading ? 'loading...' : `Subscribe ${selectedPlan.cost} / monthly` }}
                  </BaseButton>
                </div>
              </form>
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
