interface UserState {
  token: string
  userInfo: UserInfo | null | any
  preHistory: string
}
interface UserInfo {
  id: number
  userId: string
  companyId: number
  nickname: string
  phone: string
  sex: 1
  photo: string
  provinceId: string
  cityId: string
  countyId: string
  roleIds: string
  createTime: number
  updateTime: number
  lastLoginTime: null
}
