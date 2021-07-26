import { api } from 'boot/axios'

export const addTagApi = (data: any) =>
  api({
    url: '/api/v1/tags',
    method: 'post',
    data
  })

export const getTagListApi = () =>
  api({
    url: '/api/v1/tags',
    method: 'get'
  })

export const deleteTagApi = (id: number) =>
  api({
    url: `/api/v1/tags/${id}`,
    method: 'delete'
  })

export const updateTagApi = (data: any, id: number) =>
  api({
    url: `/api/v1/tags/${id}`,
    method: 'put',
    data
  })
