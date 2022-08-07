import http from '@/libs/http/index'
const basePath = '/xxxx-admin/'
import userRoleList from './mock/admin/user-role-list.json'
import userList from './mock/admin/user-list.json'
import userDetail from './mock/admin/user-detail.json'
//主要为后台管理用户提供接口
export default {
  getUserList(params: { nickname?: string; phone?: string }) {
    return Promise.resolve(userList)
  },
  getUserDetail(userId?: string) {
    return Promise.resolve(userDetail)
  },
  addUser(params: { username: string; nickname: string; phone: string }) {
    return Promise.resolve({ code: 200, msg: 'success', data: {} })
  },
  updateUser(params: {
    userId: string | number
    username?: string
    nickname: string
    phone?: string
    checkCode?: string
  }) {
    return Promise.resolve({ code: 200, msg: 'success', data: {} })
  },
  updateUserStatus(params: { userId: string; state: number }) {
    return Promise.resolve({ code: 200, msg: 'success', data: {} })
  },
  getUserRoleList(userId: string) {
    return Promise.resolve(userRoleList)
  },
  setUserRole(userId: string, roleidList: any[]) {
    return Promise.resolve({ code: 200, msg: 'success', data: {} })
  },
  resetPassword(userId: string) {
    return Promise.resolve({ code: 200, msg: 'success', data: {} })
  },
}
