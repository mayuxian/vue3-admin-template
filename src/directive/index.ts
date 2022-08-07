const modules = import.meta.globEager('./**/*.[t|j]s')

let directiveConfig: any = []
Object.keys(modules).forEach(key => {
  if (key === './index.ts') return
  directiveConfig = directiveConfig.concat(modules[key].default)
})

// export default directiveConfig
export default {
  install: (app: any, options: any) => {
    directiveConfig.forEach((d: any) => d?.install(app, options))
  },
}
