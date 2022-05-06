import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}
const api = axios.create({ baseURL: '/' })

export default boot(({
  app,
  store,
  router
}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  api.interceptors.request.use(
    (config) => {
      const token = store.state.userModule.token
      if (token) {
        config.headers.Authorization = `Bearer ${String(token)}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  api.interceptors.response.use(
    (response) => {
      const res = response.data
      // code-0,请求成功；code-1，未登录；code-2,服务器返回失败信息
      if (res.code === 0) {
        res.message && Notify.create({
          type: 'positive',
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
          setTimeout(() => {
            void store.dispatch('userModule/resetToken')
            void router.push('/login')
          }, 1000)
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
  app.config.globalProperties.$api = api
})

export { api }
