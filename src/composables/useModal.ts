import { onMounted, ref } from 'vue'
import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'

const useModal = (modal: string) => {
  const modalInstance = ref<ModalInterface>()

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
    try {
      const modalOptions: ModalOptions = {
        backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
      }
      // NOTE: Can't find modal references if they are inside a v-if condition
      // @ts-ignore
      const $modalElement: HTMLElement = document.querySelector(modal)

      if ($modalElement) {
        modalInstance.value = new Modal($modalElement, modalOptions)
      }
    } catch (err) {
      console.error(err)
    }
  })

  return { show, hide }
}

export { useModal }
