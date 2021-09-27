import { api } from 'boot/axios'

export const addArticleApi = (data: any) =>
  api({
    url: '/api/v1/articles',
    method: 'post',
    data
  })

export const editArticleApi = (data: any, id: string) =>
  api({
    url: `/api/v1/articles/${id}`,
    method: 'put',
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

export const uploadImageApi = (data: any) =>
  api({
    url: 'https://image.fendy5.cn/api/v1/upload?100%=true',
    method: 'post',
    data
  })
