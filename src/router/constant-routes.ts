import type { RouteRecordRaw } from 'vue-router'
const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/:path(.*)',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      noHistory: true,
      noCheck: true,
    },
  },
  {
    path: '/redirect/:path(.*)',
    name: 'redirect',
    component: () => import('@/views/redirect/index.vue'),
    meta: {
      noCheck: true,
    },
  },
]
export default constantRoutes
