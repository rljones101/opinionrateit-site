<script setup lang="ts">
import CheckListItem from '@/components/CheckListItem.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PricingCard from '@/components/cards/PricingCard.vue'
import { useUserStore } from '@/stores/user'
import FormContainer from '@/components/containers/FormContainer.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import AppHeader from '@/components/appHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import reviewerController from '@/controllers/reviewerController'
import UserAvatar from '@/components/UserAvatar.vue'
import FormTextarea from '@/components/inputs/FormTextarea.vue'

const router = useRouter()
const userStore = useUserStore()

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
  role: 'user'
}

const form = ref(defaultForm)
const loadedYouTubeData = ref(false)

const register = async () => {
  try {
    const fullName = form.value.firstName.trim() + ' ' + form.value.lastName.trim()

    const submittedForm = {
      ...form.value,
      name: fullName
    }
    console.log('register form', submittedForm)
    // call api
    // log in user
    await userStore.signupUser(submittedForm)
    // send
    await router.push({ name: 'videos' })
    // reset form
    form.value = { ...defaultForm }
  } catch (err) {
    console.error(err)
  }
}

const getChannelDetails = async () => {
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
  } catch (err) {
    console.error(err)
  }
}

const clearYouTubeData = () => {
  form.value.youTubeChannelId = ''
  form.value.title = ''
  form.value.description = ''
  form.value.avatar = ''
}

const isReviewerPlan = (role: string) => {
  return ['reviewer-basic', 'reviewer-plus'].includes(role)
}

const selectPlan = (plan: string) => {
  if (plan === 'user') {
    loadedYouTubeData.value = false
    clearYouTubeData()
  }
  form.value.role = plan
}
</script>

<template>
  <div class="relative flex flex-col w-full h-full overflow-y-auto">
    <app-header />
    <div class="max-w-7xl w-full mx-auto flex flex-col p-8">
      <div
        class="flex flex-col items-center space-y-8 lg:space-y-0 lg:flex-row flex-auto lg:space-x-8 justify-between mb-8"
      >
        <PricingCard
          :active="form.role === 'user'"
          plan-name="Free Plan"
          @selected="selectPlan('user')"
        >
          <template #list>
            <CheckListItem :line-through="false" :is-checked="true"
              >Allowed Reviewer Access</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Give Reviewer Feedback</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Bookmark Reviewers</CheckListItem
            >
            <CheckListItem :line-through="true" :is-checked="false">Add Your Reviews</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Metric analysis</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Patreon Support</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Vinmeo</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Twitter</CheckListItem>
          </template>
        </PricingCard>
        <PricingCard
          :active="form.role === 'reviewer-basic'"
          plan-name="Basic Plan"
          pricing="4.99"
          annual-discount-price="36"
          @selected="selectPlan('reviewer-basic')"
        >
          <template #list>
            <CheckListItem :line-through="false" :is-checked="true"
              >Allowed Reviewer Access</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Give Reviewer Feedback</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Bookmark Reviewers</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true">Add Your Reviews</CheckListItem>
            <CheckListItem :line-through="false" :is-checked="true">Metric analysis</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Patreon Support</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Vinmeo</CheckListItem>
            <CheckListItem :line-through="true" :is-checked="false">Twitter</CheckListItem>
          </template>
        </PricingCard>
        <PricingCard
          :active="form.role === 'reviewer-plus'"
          :is-disabled="true"
          plan-name="Premium Plan"
          pricing="19.99"
          annual-discount-price="180"
          @selected="selectPlan('reviewer-plus')"
        >
          <template #list>
            <CheckListItem :line-through="false" :is-checked="true"
              >Allowed Reviewer Access</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Give Reviewer Feedback</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true"
              >Bookmark Reviewers</CheckListItem
            >
            <CheckListItem :line-through="false" :is-checked="true">Add Your Reviews</CheckListItem>
            <CheckListItem :line-through="false" :is-checked="true">Metric analysis</CheckListItem>
            <CheckListItem :line-through="false" :is-checked="true">Patreon Support</CheckListItem>
            <CheckListItem :line-through="false" :is-checked="true">Vinmeo</CheckListItem>
            <CheckListItem :line-through="false" :is-checked="true">Twitter</CheckListItem>
          </template>
        </PricingCard>
      </div>

      <div
        class="flex flex-col items-center rounded-lg bg-app-blue-soft mx-auto max-w-sm p-8 mb-8 space-y-6 text-center"
        v-if="isReviewerPlan(form.role) && !loadedYouTubeData"
      >
        <div class="p-8 flex flex-col items-center border rounded-lg border-slate-500">
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
        <p>Please provide your Youtube Channel ID so we can setup your reviewer account</p>
        <FormInput id="channelId" v-model="form.youTubeChannelId" class="text-center" />
        <BaseButton
          class="border border-app-orange text-app-orange hover:bg-app-orange hover:text-white"
          @click="getChannelDetails"
          >Get My YouTube Profile</BaseButton
        >
      </div>

      <FormContainer class="w-full" v-if="!isReviewerPlan(form.role)">
        <div class="flex flex-col md:flex-row flex-auto md:gap-6 w-full">
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
        <FormInput id="email" v-model="form.email" type="email" label="Your email" required />
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
        <div class="flex w-full justify-end">
          <BaseButton class="bg-orange-500" @click="register">Register</BaseButton>
        </div>
      </FormContainer>

      <FormContainer class="w-full" v-if="isReviewerPlan(form.role) && loadedYouTubeData">
        <div
          v-if="
            (form.youTubeChannelId && form.role === 'reviewer-basic') ||
            form.role === 'reviewer-plus'
          "
          class="space-y-6"
        >
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
              rows="10"
              v-model.trim="form.description"
              placeholder="Write your description here..."
            />
          </div>
        </div>
        <div class="flex flex-col md:flex-row flex-auto md:gap-6 w-full">
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
        <FormInput id="email" v-model="form.email" type="email" label="Your email" required />
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
        <div class="flex w-full justify-end">
          <BaseButton class="bg-orange-500" @click="register">Register</BaseButton>
        </div>
      </FormContainer>

      <!--      <div class="flex items-start mb-6">-->
      <!--        <div class="flex items-center h-5">-->
      <!--          <input-->
      <!--            id="terms"-->
      <!--            type="checkbox"-->
      <!--            value=""-->
      <!--            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"-->
      <!--            required-->
      <!--          />-->
      <!--        </div>-->
      <!--        <label for="terms" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"-->
      <!--          >I agree with the-->
      <!--          <a href="#" class="text-blue-600 hover:underline dark:text-blue-500"-->
      <!--            >terms and conditions</a-->
      <!--          >-->
      <!--        </label>-->
      <!--      </div>-->
    </div>

    <AppFooter />
  </div>
</template>

<style scoped></style>
