import { api } from 'boot/axios'

export const addArticleApi = (data: any) =>
  api({
    url: '/api/v1/articles',
    method: 'post',
    data
  })

export const getArticleListApi = (params?: any) =>
  api({
    url: '/api/v1/articles',
    method: 'get',
    params
  })

export const deleteArticleApi = (id: string) =>
  api({
    url: `/api/v1/articles/${id}`,
    method: 'delete'
  })

export const getArticleApi = (id: string) =>
  api({
    url: `/api/v1/articles/${id}`,
    method: 'get'
  })
