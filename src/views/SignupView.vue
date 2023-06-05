<script setup lang="ts">
import PageContainer from '@/components/containers/PageContainer.vue'
import CheckListItem from '@/components/CheckListItem.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PricingCard from '@/components/cards/PricingCard.vue'
import { useUserStore } from '@/stores/user'

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
  <PageContainer>
    <form class="max-w-7xl mx-auto" @submit.prevent>
      <div class="flex flex-col items-center md:flex-row flex-auto gap-8 justify-center mb-8">
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

      <div
        class="mb-6 flex-1"
        v-if="form.role === 'reviewer-basic' || form.role === 'reviewer-plus'"
      >
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Youtube Channel ID</label
        >
        <input
          v-model="form.youTubeChannelId"
          type="text"
          id="youTubeChannelId"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="Channel ID"
          required
        />
      </div>
      <div class="flex flex-col md:flex-row flex-auto md:gap-6 w-full">
        <div class="mb-6 flex-1">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >First Name</label
          >
          <input
            v-model="form.firstName"
            type="text"
            id="firstName"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="First name"
            required
          />
        </div>
        <div class="mb-6 flex-1">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Last Name</label
          >
          <input
            v-model="form.lastName"
            type="text"
            id="lastName"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Last name"
            required
          />
        </div>
      </div>
      <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your email</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="email@example.com"
          required
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your password</label
        >
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="repeat-password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Repeat password</label
        >
        <input
          v-model="form.passwordConfirm"
          type="password"
          id="repeat-password"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
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
      <div class="flex w-full justify-end">
        <BaseButton class="bg-orange-500" @click="register">Register</BaseButton>
      </div>
    </form>
  </PageContainer>
</template>

<style scoped></style>
