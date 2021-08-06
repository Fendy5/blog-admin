import { GetterTree } from 'vuex'
import { StateInterface } from 'src/store'
import { UserState } from './state'

const getters: GetterTree<UserState, StateInterface> = {
  token (state: UserState) {
    return state.token
  }
}

export default getters
