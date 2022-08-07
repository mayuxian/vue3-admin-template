interface Permission {
  routes?: Array<PermissionRoute> | null
  auths?: Partial<any>
}

interface PermissionRoute {
  path: string
  name?: string
  children?: Array<PermissionRoute>
  meta?: any
}
