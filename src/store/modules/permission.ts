import { defineStore, acceptHMRUpdate } from 'pinia'
import { APP_NAME } from '@/define/constants'
import permApi from '@/api/permission'
import { allRoutes } from '@/router/index'

const STORE_KEY = APP_NAME + '-PERMISSION'

export const usePermissionStore = defineStore({
  id: STORE_KEY,
  state: (): Permission => ({
    routes: [],
    auths: {},
  }),
  getters: {
    getRoutes: (state: Permission) => {
      return state.routes || []
    },
    getAuths: (state: Permission) => {
      return state.auths || {}
    },
  },
  actions: {
    async initRoutesAsync() {
      const data = await requestPermissionAsync()
      if (!data) return []
      //匹配权限路由
      const flatRoutes = flatRouteTree(allRoutes)
      const newRoutes = matchRoutes(data, flatRoutes)
      if (!this.routes?.length) {
        this.routes = newRoutes
      } else {
        reMapRoutes(this.routes, newRoutes)
      }
      //生成按钮权限
      this.auths = generateButtonAuth(data)
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
      },
    ],
  },
})
function reMapRoutes(oldRoutes: any[], newRoutes: any[]) {
  delLegacyRoutes(oldRoutes, newRoutes)
  newRoutes?.forEach((newRoute: any) => {
    const oldRoute = oldRoutes.find(
      (x: any) => x.name === newRoute.name || x.path === newRoute.path
    )
    if (oldRoute) {
      if (oldRoute.children && newRoute.children) {
        reMapRoutes(oldRoute.children, newRoute.children)
      }
      Object.assign(oldRoute, newRoute)
    } else {
      oldRoutes.push(newRoute)
    }
  })
}
function delLegacyRoutes(oldRoutes: any[], newRoutes: any[]) {
  if (!oldRoutes?.length) return
  for (let i = 0; i < oldRoutes?.length; i++) {
    const oldRoute = oldRoutes[i]
    const newRoute = newRoutes?.find(
      (x: any) => x.name === oldRoute.name || x.path === oldRoute.path
    )
    if (!newRoute) {
      oldRoutes.splice(i, 1)
    } else {
      delLegacyRoutes(oldRoute.children, newRoute.children)
    }
  }
}

function generateButtonAuth(data: any) {
  const btnAuths: Partial<any> = {}
  const getButtonAuthLoop = (arr: any) => {
    arr?.forEach((menu: any) => {
      menu?.buttons?.forEach((btn: any) => {
        btnAuths[btn.authKey] = true
      })
      if (menu.children?.length) {
        getButtonAuthLoop(menu.children)
      }
    })
  }
  getButtonAuthLoop(data)
  return btnAuths
}

//#region 匹配权限路由
function flatRouteTree(routes: Array<any>, flatRoutes?: any) {
  const _flatRoutes = flatRoutes || new Array<any>()
  routes.forEach(r => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { children, component, components, ...route } = r
    _flatRoutes.push(r)
    if (r.children) {
      flatRouteTree(r.children, _flatRoutes)
    }
  })
  return _flatRoutes
}
async function requestPermissionAsync() {
  try {
    const res = await permApi.getAdminMenus()
    // const res = await permApi.getPermission()
    return res?.data
  } catch (err: any) {
    console.error(err)
    return null
  }
}

function matchRoutes(permList: Array<any>, appRoutes: Array<any>) {
  const routes = new Array<any>()
  permList.forEach((perm: any) => {
    const route = appRoutes.find((r: any) => r.authKey === perm.authKey)
    if (route) {
      route.meta = route.meta || {}
      route.meta.title = perm.label
      let child = null
      if (perm.children) {
        child = matchRoutes(perm.children, appRoutes)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, component, components, ...r } = route
      routes.push({
        ...r,
        children: child,
      })
    }
  })
  return routes
}
//#endregion
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot))
}
