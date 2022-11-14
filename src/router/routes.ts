import { RouteRecordRaw } from 'vue-router'
const modules = import.meta.globEager('./modules/**/*.ts')
const routes: Array<RouteRecordRaw> = []
Object.keys(modules || {}).forEach(key => {
  const route = modules[key].default
  if (route) {
    if (Array.isArray(route)) {
      routes.push(...route)
    } else {
      routes.push(route)
    }
  } else {
    console.warn(`router:${key}未导出默认值`)
  }
})

export default routes
