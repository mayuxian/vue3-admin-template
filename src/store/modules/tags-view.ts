import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
const STORE_KEY = APP_NAME + '-TAGSVIEW'
interface TagsView {
  visitedViews: any[]
  cachedViews: any[]
}
function matchObject(leftObj: any, rightObj: any) {
  const leftKeys = Object.keys(leftObj)
  const rightKeys = Object.keys(rightObj)
  if (leftKeys.length != rightKeys.length) return false
  return !leftKeys.some(
    (key: any) => key != 'time' && leftObj[key] !== rightObj[key]
  )
}
function matchRoute(routeItem: any, curRoute: any) {
  if (curRoute?.meta?.divide) {
    return (
      routeItem.name == curRoute.name &&
      matchObject(routeItem.query, curRoute.query) &&
      matchObject(routeItem.params, curRoute.params)
    )
  } else {
    return routeItem.name === curRoute.name || routeItem.path === curRoute.path
  }
  // return curRoute.meta.divide
  //   ? curRoute.fullPath === route.fullPath
  //   : curRoute.name === route.name || curRoute.path === route.path
}
export const useTagsViewStore = defineStore({
  id: STORE_KEY,
  state: (): TagsView => ({
    visitedViews: [],
    cachedViews: [],
  }),
  getters: {
    getVisitedViews: (state: TagsView) => {
      return state.visitedViews
    },
    getCachedViews: (state: TagsView) => {
      return state.cachedViews
    },
  },
  actions: {
    addView(view: any) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view: any) {
      if (view.meta?.subpage) return //匹配路由>=3个属于二级子页面，则不需要tag
      if (
        this.visitedViews.some((v: any) => {
          return matchRoute(v, view)
        })
      ) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { redirectedFrom, matched, ...viewData } = view
      this.visitedViews.push(
        Object.assign({}, viewData, {
          title: view.meta?.divide
            ? `${view.meta.title}-${view.query.title || view.params.name}`
            : view.meta.title,
          // query: view.query || {},
          // params: view.params || {},
        })
      )
    },
    addCachedView(view: any) {
      const viewName = view.meta.cacheName || view.name
      if (this.cachedViews.includes(viewName)) return
      if (!view.meta.noCache) {
        this.cachedViews.push(viewName)
      }
    },
    delView(view: any) {
      this.delVisitedView(view)
      this.delCachedView(view)
    },
    delVisitedView(view: any) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (matchRoute(v, view)) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    delCachedView(view: any) {
      const viewName = view.meta.cacheName || view.name
      const index = this.cachedViews.indexOf(viewName)
      index > -1 && this.cachedViews.splice(index, 1)
    },
    delOthersViews(view: any) {
      this.delOthersVisitedViews(view)
      this.delOthersCachedViews(view)
    },
    delOthersVisitedViews(view: any) {
      this.visitedViews = this.visitedViews.filter((v: any) => {
        return v.meta.affix || matchRoute(v, view)
      })
    },
    delOthersCachedViews(view: any) {
      const viewName = view.meta.cacheName || view.name
      const index = this.cachedViews.indexOf(viewName)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        this.cachedViews = []
      }
    },
    delAllViews() {
      this.delAllVisitedViews()
      this.delAllCachedViews()
    },
    delAllVisitedViews() {
      // keep affix tags
      const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
      this.visitedViews = affixTags || []
    },
    delAllCachedViews() {
      this.cachedViews = []
    },
    updateVisitedView(view: any) {
      for (let v of this.visitedViews) {
        if (matchRoute(v, view)) {
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          const { redirectedFrom, matched, ...viewData } = view
          v = Object.assign(v, viewData)
          break
        }
      }
    },
    matchTagView(route: any) {
      const tagview = this.visitedViews.find((vRoute: any) => {
        return (
          route.name == vRoute.name &&
          matchObject(route.query, vRoute.query) &&
          matchObject(route.params, vRoute.params)
        )
      })
      return tagview
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
      },
    ],
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsViewStore, import.meta.hot))
}
