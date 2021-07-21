import { api } from 'boot/axios'

export const loginApi = () => {
  return api({
    url: '/api/v1/articles',
    method: 'get'
  })
}
