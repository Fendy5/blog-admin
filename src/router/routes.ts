import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/writing',
        component: () => import('pages/writing/index.vue')
      },
      {
        path: '/article',
        component: () => import('pages/article/index.vue')
      },
      {
        path: '/tag',
        component: () => import('pages/tag/index.vue')
      },
      {
        path: '/menu',
        component: () => import('pages/menu/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/login/index.vue')
  },
  // {
  //   path: '/article',
  //   component: () => import('pages/article/index.vue'),
  //   children: [{ path: '', component: () => import('pages/Index.vue') }]
  // },
  // {
  //   path: '/tag',
  //   component: () => import('pages/tag/index.vue'),
  //   children: [{ path: '', component: () => import('pages/Index.vue') }]
  // },
  // {
  //   path: '/menu',
  //   component: () => import('pages/menu/index.vue'),
  //   children: [{ path: '', component: () => import('pages/Index.vue') }]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
