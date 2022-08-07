import { defineStore, acceptHMRUpdate } from 'pinia'
const STORE_KEY = import.meta.env.VITE_APP_NAME + '-USER'
import store from '../index'
import loginApi from '@/api/login'
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
    getUserId: (state: UserState): string | undefined => state.userInfo?.userId,
    hasLogged: (state: UserState): boolean => !!state.token,
    //TODO:需要获取用户信息后使用此逻辑 !!state.token && !!state.userInfo?.userId,
    getUserInfo: (state: UserState): UserInfo | null => {
      return state.userInfo as UserInfo
    },
    hasIdentity: (state: UserState): boolean | null => {
      if (!state.userInfo) return null //未获取用户信息
      return (state.userInfo as UserInfo)?.identitySave === 1
    },
  },
  actions: {
    async logout() {
      await loginApi.logout()
      this.removeToken()
      this.setUserInfo()
      window.location.reload()
    },
    setToken(data: string) {
      this.token = data
    },
    removeToken() {
      this.token = ''
      this.userInfo = null
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
