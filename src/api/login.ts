import { api } from 'boot/axios'

export const loginApi = (data: any) => {
  return api({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

export const getUserInfoApi = () => {
  return api({
    url: '/api/v1/admin/getUserInfo',
    method: 'get'
  })
}
