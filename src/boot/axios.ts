import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.BASE_API })
api.interceptors.response.use(
  (response) => {
    const res = response.data
    // code-0,请求成功；code-1，未登录；code-2,服务器返回失败信息
    if (res.code === 0) {
      res.message && Notify.create({
        message: res.message
      })
      return res
    } else if (res.code === 1 || res.code === 2) {
      Notify.create({
        type: 'negative',
        position: 'top',
        message: res.message
      })
      if (res.code === 1) {
        // setTimeout(() => {
        //   UserModule.ResetToken()
        //   location.reload()
        // }, 1000)
      }
      return Promise.reject(res)
    }
  }, (error) => {
    Notify.create({
      type: 'negative',
      position: 'top',
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
