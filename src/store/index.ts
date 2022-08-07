import { createPinia } from 'pinia'
const store = createPinia()
import piniaPluginPersist from 'pinia-plugin-persist'
store.use(piniaPluginPersist)
export default store
