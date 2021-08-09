import { MutationTree } from 'vuex'
import { UserState } from './state'

const mutation: MutationTree<UserState> = {
  SET_TOKEN (state: UserState, token: string) {
    state.token = token
  },
  RESET_TOKEN (state: UserState) {
    state.token = ''
  }
}

export default mutation
