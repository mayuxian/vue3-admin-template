import { createApp } from 'vue'
import App from './App.vue'
//提升css超过router，尝试解决safari布局错乱问题
import './assets/styles/index.scss'

import router from './router/index'
import store from './store/index'

import 'dayjs/locale/zh-cn'
import plugins from './plugins/index'
//目前只支持全量，按需引入官网正在开发中
import * as Icons from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'

// import 'core-js' //需要按需引入
import directives from './directive/index'

const app = createApp(App)

// 注册全局ICON
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(ElementPlus)

app.use(router)
app.use(store)
app.use(plugins)
app.use(directives)

app.mount('#app')
