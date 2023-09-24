<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import UserAvatar from '@/components/UserAvatar.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import FormTextarea from '@/components/inputs/FormTextarea.vue'
import * as yup from 'yup'
import SubmitButton from '@/components/buttons/SubmitButton.vue'

const props = defineProps<{
  formData: {
    youTubeChannelId: string
    title: string
    description: string
    avatar: string
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    role: string
  }
}>()

const emit = defineEmits(['submit'])

const loading = ref(false)

let form = {
  youTubeChannelId: '',
  title: '',
  description: '',
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: '',
  ...props.formData
}

const accountFormSchema = yup.object({
  firstName: yup.string().required().label('First Name'),
  lastName: yup.string().required().label('Last Name'),
  email: yup.string().required().email().label('Email'),
  password: yup.string().min(6).required().label('Your Password'),
  passwordConfirm: yup
    .string()
    .required()
    .min(6)
    .oneOf([yup.ref('password'), 'Password does not match'])
    .label('Confirm Password')
})
const registerForm = useForm({
  validationSchema: accountFormSchema,
  initialValues: form
})

// methods
const handleSubmitAccount = registerForm.handleSubmit((values) => {
  const formValues = { ...form }
  form = {
    ...formValues,
    ...values
  }
  emit('submit', form)
})
</script>

<template>
  <form @submit="handleSubmitAccount" class="flex-1 flex flex-col">
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
          name="Youtube Title"
          type="text"
          label="YouTube Title"
          class="flex-1"
          v-model="form.youTubeChannelId"
        />

        <div>
          <label for="description" class="block mb-2 text-sm font-medium text-slate-300"
            >YouTube Description</label
          >
          <FormTextarea
            name="Description"
            rows="5"
            placeholder="Write your description here..."
            v-model="form.description"
          />
        </div>
      </div>
      <!-- user name, email and password -->
      <div class="flex flex-col md:flex-row flex-auto md:gap-6 w-full">
        <input type="hidden" name="role" v-model="form.role" />
        <FormInput
          name="firstName"
          type="text"
          label="First Name"
          v-model="form.firstName"
          class="flex-1"
        />
        <FormInput
          name="lastName"
          type="text"
          label="Last Name"
          v-model="form.lastName"
          class="flex-1"
        />
      </div>
      <FormInput
        name="email"
        label="Email"
        type="email"
        placeholder="johndoe@example.com"
        v-model="form.email"
      />
      <FormInput
        name="password"
        type="password"
        label="Your password"
        v-model="form.password"
        required
      />
      <FormInput
        name="passwordConfirm"
        type="password"
        label="Repeat password"
        v-model="form.passwordConfirm"
        required
      />
    </div>
    <div class="form-controls">
      <SubmitButton :disabled="!registerForm.meta.value.valid" class="max-w-fit">
        {{ loading ? 'loading...' : 'Continue' }}
      </SubmitButton>
    </div>
  </form>
</template>

<style scoped></style>
