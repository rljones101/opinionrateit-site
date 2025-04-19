import { ref } from 'vue'

export function useReducer(reducer: any, initialState: any) {
  const state = ref(initialState)
  function dispatch(action: any) {
    state.value = reducer(state.value, action)
    return state.value
  }
  return [state, dispatch]
}
