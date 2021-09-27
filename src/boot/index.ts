import { getUserInfoApi } from 'src/api/login'

export default ({
  router,
  store
}) => {
  if (store.getters['userModule/token']) {
    void getUserInfoApi()
  } else {
    void store.dispatch('userModule/resetToken')
    void router.push('/login')
  }
}
