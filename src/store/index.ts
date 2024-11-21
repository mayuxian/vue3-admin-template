import { createPinia } from 'pinia'
const store = createPinia()
//TODO:后续需要换成 pinia-plugin-persistedstate ，pinia-plugin-persist已不维护。modules的方式和storage都要修改下
import piniaPluginPersist from 'pinia-plugin-persist'
store.use(piniaPluginPersist)
export default store
