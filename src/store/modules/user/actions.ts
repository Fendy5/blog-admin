import { ActionTree } from 'vuex'
import { StateInterface } from 'src/store'
import { UserState } from './state'
import { removeToken, setToken } from 'src/utils/cookie'

const actions: ActionTree<UserState, StateInterface> = {
  setTokenAction (context, token: string) {
    setToken(token)
    context.commit('SET_TOKEN', token)
  },
  resetToken (context) {
    removeToken()
    context.commit('RESET_TOKEN')
  }
}

export default actions
