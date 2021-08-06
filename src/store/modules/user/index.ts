import { Module } from 'vuex'
import { state, UserState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { StateInterface } from 'src/store'

const userModule: Module<UserState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default userModule
