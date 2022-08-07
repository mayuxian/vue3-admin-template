import http from '@/libs/http/index'
const basePath = '/xxx-admin/'
import authList from './mock/auth/list.json'
import authMenu from './mock/auth/menu.json'
export default {
  addAuth(name: string) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  getAuthList(params: object) {
    return Promise.resolve(authList)
  },
  deleteAuth(authId: string) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  updateAuth(id: string, name: string) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  updateAuthMenu(params: { id: string; roleName: string }) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  getAuthMenuList(id: string) {
    return Promise.resolve(JSON.parse(JSON.stringify(authMenu)))
  },
  setAuthMenuList(params: { authId: string }) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
}
