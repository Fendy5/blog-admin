import { api } from 'boot/axios'

export const addArticleApi = (data: any) =>
  api({
    url: '/api/v1/articles',
    method: 'post',
    data
  })
