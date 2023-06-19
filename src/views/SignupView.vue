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

const router = useRouter()
const userStore = useUserStore()

const defaultForm = {
  youTubeChannelId: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'user'
}

const form = ref(defaultForm)

const register = async () => {
  try {
    const fullName = form.value.firstName + ' ' + form.value.lastName

    const submittedForm = {
      ...form.value,
      name: fullName
    }
    console.log('register form', submittedForm)
    // call api
    // log in user
    await userStore.signupUser(submittedForm)
    // send
    await router.push({ name: 'reviewers' })
    // reset form
    form.value = { ...defaultForm }
  } catch (err) {
    console.error(err)
  }
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
          @selected="form.role = 'user'"
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
          @selected="form.role = 'reviewer-basic'"
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
          @selected="form.role = 'reviewer-plus'"
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
      <FormContainer class="w-full">
        <div
          class="mb-6 flex-1"
          v-if="form.role === 'reviewer-basic' || form.role === 'reviewer-plus'"
        >
          <FormInput
            id="channelId"
            v-model="form.youTubeChannelId"
            type="text"
            label="YouTube Channel ID"
          />
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
