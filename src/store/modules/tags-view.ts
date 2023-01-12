import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
const STORE_KEY = APP_NAME + '-TAGSVIEW'
interface TagsView {
  visitedViews: any[]
  cachedViews: any[]
}
function matchRoute(routeItem: any, curRoute: any) {
  return curRoute.meta?.divide
    ? routeItem.fullPath === curRoute.fullPath
    : routeItem.name === curRoute.name || routeItem.path === curRoute.path
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
      const title =
        view.meta.title || view.params.title || view.query.titile || 'no-name'
      const divideTitle = `${title}-${view.query.name || view.params.name}`
      this.visitedViews.push(
        Object.assign({}, viewData, {
          title: view.meta?.divide ? divideTitle : title,
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
