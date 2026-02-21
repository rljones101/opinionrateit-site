import { ref, computed, readonly, type UnwrapRef } from 'vue'

export interface AsyncDataState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  options: {
    immediate?: boolean
    onError?: (error: Error) => void
    onSuccess?: (data: T) => void
  } = {}
) {
  const { immediate = true, onError, onSuccess } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const isIdle = computed(() => !loading.value && !error.value && data.value === null)
  const isLoading = computed(() => loading.value)
  const isError = computed(() => !!error.value)
  const isSuccess = computed(() => !loading.value && !error.value && data.value !== null)

  const execute = async (): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null
      
      const result = await asyncFunction()
      data.value = result
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      
      if (onError) {
        onError(errorObj)
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  const refresh = () => execute()

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  if (immediate) {
    execute()
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    isIdle,
    isLoading,
    isError,
    isSuccess,
    execute,
    refresh,
    reset
  }
}

export function useAsyncState<T>(initialValue: T) {
  const state = ref<AsyncDataState<T>>({
    data: initialValue,
    loading: false,
    error: null
  })

  const setLoading = (loading: boolean) => {
    state.value.loading = loading
  }

  const setData = (data: T) => {
    state.value.data = data as UnwrapRef<T> | null
    state.value.error = null
  }

  const setError = (error: Error) => {
    state.value.error = error
    state.value.loading = false
  }

  const reset = () => {
    state.value = {
      data: initialValue,
      loading: false,
      error: null
    }
  }

  return {
    state: readonly(state),
    setLoading,
    setData,
    setError,
    reset
  }
}