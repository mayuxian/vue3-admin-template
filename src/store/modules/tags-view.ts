import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
const STORE_KEY = APP_NAME + '-TAGSVIEW'
interface TagsView {
  visitedViews: any[]
  cachedViews: any[]
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
      if (
        this.visitedViews.some(
          v => v.name === view.name || v.path === view.path
        )
      )
        return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { redirectedFrom, matched, ...viewData } = view
      // console.log('viewData 1', viewData)
      // console.log('viewData 2', toRaw(viewData))
      // console.log('viewData 3', unref(viewData))
      this.visitedViews.push(
        Object.assign({}, viewData, {
          title:
            view.meta.title ||
            view.params.title ||
            view.query.titile ||
            'no-name',
          query: view.query || {},
          params: view.params || {},
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
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    delCachedView(view: any) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },

    delOthersViews(view: any) {
      this.delOthersVisitedViews(view)
      this.delOthersCachedViews(view)
    },
    delOthersVisitedViews(view: any) {
      this.visitedViews = this.visitedViews.filter((v: any) => {
        return v.meta.affix || v.path === view.path
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
      this.visitedViews = affixTags
    },
    delAllCachedViews() {
      this.cachedViews = []
    },

    updateVisitedView(view: any) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          // eslint-disable-next-line no-unused-vars
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
