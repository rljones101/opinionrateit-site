import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Global state for the login dialog.
 *
 * Any component can open the login dialog from anywhere (header, nav, a
 * sign-in prompt, a route guard) without navigating away from the current
 * page. An optional `redirect` target is remembered so the user can be sent
 * there after a successful login.
 */
export const useLoginDialogStore = defineStore('loginDialog', () => {
  const isOpen = ref(false)
  const redirect = ref<string | null>(null)

  const open = (redirectTo: string | null = null) => {
    redirect.value = redirectTo
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    redirect.value = null
  }

  return { isOpen, redirect, open, close }
})
