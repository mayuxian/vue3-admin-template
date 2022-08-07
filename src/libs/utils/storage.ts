import qs from 'qs'
export const $localStorage = {
  /**
   *@params expires 过期时间,单位毫秒
   */
  setItem(key: string, value: any, expires?: number) {
    const data = {
      value: value,
      time: Date.now(),
      expires: expires,
    }
    window.localStorage.setItem(key, qs.stringify(data))
  },
  getItem(key: string) {
    const dataStr = window.localStorage.getItem(key)
    if (!dataStr) return dataStr
    const data = qs.parse(dataStr)
    if (data.expires && Date.now() - data.time > data.expires) {
      window.localStorage.removeItem(key)
      return null
    }
    return data.value
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key)
  },
}
export const $sessionStorage = {
  setItem(key: string, value: any) {
    window.sessionStorage.setItem(key, value)
  },
  getItem(key: string) {
    return window.sessionStorage.getItem(key)
  },
  removeItem(key: string) {
    window.sessionStorage.removeItem(key)
  },
}
