<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoginDialogStore } from '@/stores/loginDialogStore'
import UserLogin from '@/components/forms/UserLogin.vue'

const loginDialog = useLoginDialogStore()
const { isOpen } = storeToRefs(loginDialog)

const close = () => loginDialog.close()

const onSuccess = () => loginDialog.close()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

// Lock background scroll and wire the Escape key while the dialog is open.
watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="login-dialog">
    <div
      v-if="isOpen"
      class="login-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Log in"
      @click.self="close"
    >
      <div class="login-dialog-panel">
        <UserLogin dialog @success="onSuccess" @close="close" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  /* Dull out the background behind the dialog. */
  background-color: rgb(14 20 32 / 0.75);
  backdrop-filter: blur(2px);
}

.login-dialog-panel {
  position: relative;
}

/* Fade + slight scale on open/close. */
.login-dialog-enter-active,
.login-dialog-leave-active {
  transition: opacity 0.2s ease;
}

.login-dialog-enter-from,
.login-dialog-leave-to {
  opacity: 0;
}

.login-dialog-enter-active .login-dialog-panel,
.login-dialog-leave-active .login-dialog-panel {
  transition: transform 0.2s ease;
}

.login-dialog-enter-from .login-dialog-panel,
.login-dialog-leave-to .login-dialog-panel {
  transform: scale(0.96);
}
</style>
