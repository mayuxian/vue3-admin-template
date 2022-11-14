const modules = import.meta.globEager('./*.ts')
const plugins: any = []
Object.keys(modules || {}).forEach(key => {
  const plugin = modules[key].default
  if (key !== 'index.ts' && plugin) {
    if (Array.isArray(plugin)) {
      plugins.push(...plugin)
    } else {
      plugins.push(plugin)
    }
  } else {
    console.warn(`plugin:${key}未导出默认值`)
  }
})
export default {
  install: (app: any, options: object) => {
    plugins?.forEach((plugin: any) => app.use(plugin))
  },
}
