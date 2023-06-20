import { onMounted } from 'vue'

const useDialog = (idSelector: string) => {
  let dialog: HTMLDialogElement | null

  onMounted(() => {
    dialog = window.document.querySelector(idSelector)
  })

  const show = () => {
    dialog?.showModal()
  }

  const close = () => {
    dialog?.close()
  }

  return {
    show,
    close
  }
}

export { useDialog }
