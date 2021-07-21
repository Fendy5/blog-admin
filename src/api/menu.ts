import { api } from 'boot/axios'

export const getMenuListApi = () =>
  api({
    url: '/api/v1/menus',
    method: 'get'
  })

export const addMenuApi = (data: never) =>
  api({
    url: '/api/v1/menus',
    method: 'post',
    data
  })

export const deleteMenuApi = (id: number) =>
  api({
    url: `/api/v1/menus/${id}`,
    method: 'delete'
  })

export const editMenuApi = (data: never, id: number) =>
  api({
    url: `/api/v1/menus/${id}`,
    method: 'put',
    data
  })
