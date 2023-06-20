import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { Modal } from 'flowbite'

const useModal = (modal: Ref) => {
  const modalInstance = ref()

  const show = () => {
    if (modalInstance.value) {
      modalInstance.value.show()
    }
  }

  const hide = () => {
    if (modalInstance.value) {
      modalInstance.value.hide()
    }
  }

  onMounted(() => {
    const modalOptions = {
      backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
    }
    // NOTE: Can't find modal references if they are inside a v-if condition
    if (modal.value) {
      modalInstance.value = new Modal(modal.value, modalOptions)
    }
  })

  return { show, hide }
}

export { useModal }
