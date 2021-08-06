import { getToken } from 'src/utils/cookie'

export interface UserState {
  token: string
  user: {
    name: string
    avatar: string
    email: string
  }
}

export const state: UserState = {
  token: getToken() || '',
  user: {
    name: '',
    avatar: '',
    email: ''
  }
}
