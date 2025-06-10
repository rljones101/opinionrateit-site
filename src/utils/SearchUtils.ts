export function debounce(callback: any, delay = 250) {
  let timer: number
  return (...args: any[]) => {
    clearTimeout(timer)
    // @ts-ignore
    timer = setTimeout(() => callback.apply(this, args), delay)
  }
}
