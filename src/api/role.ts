import http from '@/libs/http/index'
const basePath = '/xxx-admin/'
import roleList from './mock/role/list.json'
import roleAuthList from './mock/role/auth.json'

export default {
  addRole(roleName: string) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  getRoleList(params: object) {
    return Promise.resolve(roleList)
  },
  getRoleAuthList(roleId: string) {
    return Promise.resolve(roleAuthList)
  },
  deleteRole(roleId: string) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  updateRole(params: { id: string; roleName: string }) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
  setRoleAuth(params: { authIdList: string[]; roleId: string }) {
    return Promise.resolve({ code: 200, msg: 'success' })
  },
}
