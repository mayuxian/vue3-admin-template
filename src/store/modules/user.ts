import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
import store from '../index'
import loginApi from '@/api/login'

const STORE_KEY = APP_NAME + '-USER'

export const useUserStore = defineStore({
  id: STORE_KEY,
  state: (): UserState => ({
    token: '',
    userInfo: null,
    preHistory: '',
  }),
  getters: {
    getToken: (state: UserState): string => {
      return state.token
    },
    hasLogged: (state: UserState): boolean => !!state.token,
    //TODO:需要获取用户信息后使用此逻辑 !!state.token && !!state.userInfo?.userId,
    getUserInfo: (state: UserState): UserInfo | null => {
      return state.userInfo as UserInfo
    },
  },
  actions: {
    async logout() {
      await loginApi.logout()
      this.removeToken()
      this.setUserInfo()
      // window.location.reload()
    },
    setToken(data: string) {
      this.token = data
    },
    removeToken() {
      this.token = ''
    },
    setUserInfo(data?: object) {
      if (!data) {
        this.userInfo = null
        return
      }
      if (!this.userInfo) {
        this.userInfo = {}
      }
      Object.assign(this.userInfo, data || {})
    },
    removeUserInfo() {
      this.userInfo = null
    },
    async initUserInfo() {
      const userRes = await loginApi.getUserInfo()
      this.setUserInfo(userRes?.data)
    },
	setHistory(history: string) {
      this.preHistory = history
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage, // $localStorage,
        paths: ['token'], //可以选择保存的字段  其余的不保存
      },
      {
        storage: sessionStorage,
        paths: ['preHistory'], //可以选择保存的字段  其余的不保存
      },
    ],
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
export const useUserStoreWithout = () => {
  return useUserStore(store)
}
