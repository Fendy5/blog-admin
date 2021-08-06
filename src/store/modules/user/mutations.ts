import { MutationTree } from 'vuex'
import { UserState } from './state'

const mutation: MutationTree<UserState> = {
  SET_TOKEN (state: UserState, token: string) {
    state.token = token
  }
}

export default mutation
