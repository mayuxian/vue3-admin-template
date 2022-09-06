import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
const STORE_KEY = APP_NAME + '-SETTINGS'

export const useSettingsStore = defineStore({
  id: STORE_KEY,
  state: (): AppSettings => ({
    // theme: variables.theme,
    showSettings: false,
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true,
  }),
  getters: {
    needTagsView: (state: AppSettings) => {
      return state.tagsView
    },
    canShowSettings: (state: AppSettings) => {
      return state.showSettings
    },
    canFixedHeader: (state: AppSettings) => {
      return state.fixedHeader
    },
    sidebarLogoVisible: (state: AppSettings) => {
      return state.sidebarLogo
    },
  },
  actions: {},
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
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
