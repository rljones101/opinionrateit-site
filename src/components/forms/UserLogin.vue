<script setup lang="ts">
import BaseButton from '@/components/buttons/BaseButton.vue'
import ButtonClose from '@/components/buttons/ButtonClose.vue'
import { useDialog } from '@/controllers/dialogController'
import { ref } from 'vue'
import { usersLogin } from '@/services/UserService'
import type { AppApiResponse, AppApiErrorResponse } from '@/types'

const { close } = useDialog('#UserLoginDialog')

const email = ref('')
const password = ref('')
const showError = ref(false)
const errorMessage = ref('Email and Password are required!')

const login = async () => {
  // validate
  if (!email.value || !password.value) {
    showError.value = true
  } else {
    try {
      // call service to log in the user
      const res: AppApiResponse | AppApiErrorResponse = await usersLogin(
        email.value,
        password.value
      )
      console.log(res)
      if (res.status === 'success') {
        // close dialog and clear fields and any error messages
        showError.value = false
        email.value = ''
        password.value = ''
        // const token = cookie.jwt
        // console.log(token)
        close()
      } else {
        showError.value = true
        if ('message' in res) {
          errorMessage.value = res.message
        }
      }
    } catch (err) {
      console.log('login error:', err)
    }
  }
}

const closeDialog = () => {
  // clear any error messages
  showError.value = false
  close()
}
</script>

<template>
  <dialog
    id="UserLoginDialog"
    class="w-full mx-auto max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
  >
    <form class="space-y-6" @submit.prevent>
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>
      <ButtonClose class="mr-3" @click="closeDialog" />
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your email</label
        >
        <input
          type="email"
          name="email"
          id="email"
          autocomplete="username"
          v-model="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your password</label
        >
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          autocomplete="password"
          v-model="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <div class="flex items-start">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-orange-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            />
          </div>
          <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Remember me</label
          >
        </div>
        <a href="#" class="ml-auto text-sm text-orange-700 hover:underline dark:text-orange-500"
          >Lost Password?</a
        >
      </div>
      <div v-if="showError" class="text-red-500">{{ errorMessage }}</div>
      <BaseButton class="w-full bg-orange-500" @click="login">Login to your account</BaseButton>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?
        <a href="#" class="text-orange-700 hover:underline dark:text-orange-500">Create account</a>
      </div>
    </form>
  </dialog>
</template>

<style scoped></style>
