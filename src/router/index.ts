import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import constantRoutes from './constant-routes'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import routes from './routes'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

export const allRoutes = constantRoutes.concat(routes)
export const authRoutes = routes
export const fixRoutes = constantRoutes
const router = createRouter({
  // 采用 history 模式
  history: createWebHistory('/'), //createWebHistory('/'), //TODO: createWebHashHistory('/')
  routes: allRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  if (!to.meta.noHistory) {
    userStore.setUserInfo({ preHistory: to.fullPath })
  }
  if (!to.meta.noCheck && !userStore.hasLogged && to.path !== '/login') {
    //需要登录，检查是否已登录
    next({ path: '/login' })
    NProgress.done()
  } else {
    next()
    NProgress.done()
  }
})
export default router
