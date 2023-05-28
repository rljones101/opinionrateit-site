// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { getCurrentInstance } from 'vue'

export { usePageContext }
export { setPageContext }

function usePageContext() {
  return getCurrentInstance().appContext.config.globalProperties.$pageContext
}

function setPageContext(app, pageContext) {
  //app.provide(key, pageContext)
  app.config.globalProperties.$pageContext = pageContext
}