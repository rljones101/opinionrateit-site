import { debounce } from '@/utils/SearchUtils'

let findDebounce: (value: string) => void

const find = (value: string, callback: any) => {
  if (!findDebounce) {
    findDebounce = debounce(callback, 1000)
  }
  findDebounce(value)
}

export default {
  find
}
