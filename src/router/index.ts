import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import constantRoutes from './constant-routes'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tags-view'
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
    userStore.setHistory(to.fullPath)
  }
  if (to.meta.divide && !to.query.time) {
    //若跳转到是分裂页面，则query增加时间戳t，保持每次重新打开分裂的页签time都唯一
    to.query = to.query || {}
    to.query.time = Date.now().toString()
    const tagsViewStore = useTagsViewStore()
    const matchRoute = tagsViewStore.matchTagView(to)
    if (matchRoute) {
      next({
        path: matchRoute.fullPath,
        params: matchRoute.params,
        query: matchRoute.query,
      })
    } else {
      next({
        path: to.fullPath,
        params: to.params,
        query: to.query,
      })
    }
    NProgress.done()
  } else if (!to.meta.noCheck && !userStore.hasLogged && to.path !== '/login') {
    //需要登录，检查是否已登录
    next({ path: '/login' })
    NProgress.done()
  } else {
    next()
    NProgress.done()
  }
})
export default router
