import { api } from 'boot/axios'

export const loginApi = (data: any) => {
  return api({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}
