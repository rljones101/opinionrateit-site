<script setup lang="ts">
import { SIGNUP_STEPS } from '@/types'
import { useSignupStore } from '@/stores/signupStore'
import BaseButton from '@/components/buttons/BaseButton.vue'
import FormInput from '@/components/inputs/FormInput.vue'

const signupStore = useSignupStore()
</script>

<template>
  <div
    key="YoutubeCard"
    v-show="signupStore.currentStep === SIGNUP_STEPS.ADD_YOUTUBE_ACCOUNT"
    class="flex justify-center w-full text-center"
  >
    <div id="youTubeChannelDetail" class="flex flex-col max-w-md p-8 mb-8 space-y-6">
      <p>Please provide your Youtube Channel ID<br />so we can setup your reviewer account</p>
      <div class="p-8 flex flex-col items-center border rounded-lg border-slate-700 bg-app-blue">
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
        v-model="signupStore.accountFormData.youTubeChannelId"
      />
      <div class="flex gap-4">
        <!--                <BaseButton @click="cancel">Cancel</BaseButton>-->
        <BaseButton class="w-full" type="primary" @click="signupStore.getChannelDetails"
          >Get My YouTube Profile</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
