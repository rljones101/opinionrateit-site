<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { AppApiResponse, AppApiErrorResponse } from '@/types'
import { useRouter } from 'vue-router'
import FormInput from '@/components/inputs/FormInput.vue'
import FormContainer from '@/components/containers/FormContainer.vue'
import ComponentSpinner from '@/components/spinners/ComponentSpinner.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import ButtonClose from '@/components/buttons/ButtonClose.vue'
import AppLink from '@/components/AppLink.vue'

const router = useRouter()

const { loginUser } = useUserStore()

const email = ref('')
const password = ref('')
const showError = ref(false)
const loading = ref(false)
const errorMessage = ref('Email and Password are required!')

const login = async () => {
  // validate
  if (!email.value || !password.value) {
    showError.value = true
  } else {
    try {
      loading.value = true
      // call service to log in the user
      const res: AppApiResponse | AppApiErrorResponse = await loginUser(email.value, password.value)
      if (res.status === 'success') {
        // close dialog and clear fields and any error messages
        showError.value = false
        email.value = ''
        password.value = ''
        await router.push({ name: 'videos' })
      } else {
        showError.value = true
        if ('message' in res) {
          errorMessage.value = res.message
        }
      }
    } catch (err) {
      console.log('login error:', err)
    } finally {
      loading.value = false
    }
  }
}

const closeDialog = () => {
  // clear any error messages
  showError.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="w-96 relative">
    <FormContainer class="w-full max-w-sm">
      <h5 class="text-xl font-medium">Login</h5>
      <ButtonClose
        class="mr-3 !bg-transparent border border-brand-500 !text-brand-500 hover:!bg-brand-500 hover:!text-white"
        @click="closeDialog"
      />
      <FormInput
        id="email"
        type="email"
        name="email"
        placeholder="name@company.com"
        autocomplete="username"
        v-model="email"
        required
        label="Your email"
      />
      <FormInput
        id="password"
        type="password"
        name="password"
        placeholer="••••••••"
        autocomplete="password"
        v-model="password"
        required
        label="Your password"
      />
      <!--      <div class="flex items-start">-->
      <!--        <div class="flex items-start">-->
      <!--          <div class="flex items-center h-5">-->
      <!--            <input-->
      <!--              id="remember"-->
      <!--              type="checkbox"-->
      <!--              value=""-->
      <!--              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-orange-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"-->
      <!--            />-->
      <!--          </div>-->
      <!--          <label for="remember" class="ml-2 text-sm font-medium">Remember me</label>-->
      <!--        </div>-->
      <!--      </div>-->
      <div v-if="showError" class="text-red-500">{{ errorMessage }}</div>
      <BaseButton type="primary" class="w-full" @click="login">Login to your account</BaseButton>
      <div class="flex text-sm font-medium items-center gap-2">
        Not registered?
        <AppLink to="/signup">Create Account</AppLink> |
        <AppLink to="/forgot-password">Lost Password?</AppLink>
      </div>
    </FormContainer>
    <ComponentSpinner v-if="loading" />
  </div>
</template>

<style scoped></style>
