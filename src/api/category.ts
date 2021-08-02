import { api } from 'boot/axios'

export const getCategoriesListApi = () =>
  api({
    url: '/api/v1/categories',
    method: 'get'
  })
