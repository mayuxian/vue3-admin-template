import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
const STORE_KEY = APP_NAME + '-APP'

export const useAppStore = defineStore({
  id: STORE_KEY,
  state: (): StoreApp => ({
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    device: 'desktop',
    size: 'default',
  }),
  getters: {
    getSidebarOpened: (state: StoreApp) => {
      return state.sidebar.opened
    },
    getSidebarWithoutAnimation: (state: StoreApp) => {
      return state.sidebar.withoutAnimation
    },
    getDevice: (state: StoreApp) => {
      return state.device
    },
    getSize: (state: StoreApp) => {
      return state.size
    },
  },
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
    },
    setApp(data: any) {
      Object.assign(this, data || {})
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        // paths: ['token'], //可以选择保存的字段  其余的不保存
      },
    ],
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
