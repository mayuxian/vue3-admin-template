import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//vite-plugin-vue-setup-extend插件会影响sourcemap的文件定义，所以改换如下插件。
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'

import svgIconsPlugin from './svg-icon.plugin'
import AutoImportPlugin from './auto-import.plugin'
import svgLoader from 'vite-svg-loader'
//legacy主要兼容浏览器的垫片，若index.html中引入https://polyfill.io/v3/polyfill.min.js则无需此配置
// import legacy from '@vitejs/plugin-legacy'
const vitePlugins: (PluginOption | PluginOption[])[] = [
  // have to
  vue(),
  // have to
  vueJsx(),
  vueSetupExtend(),
  svgLoader(),
  // support name
  AutoImportPlugin,
  svgIconsPlugin,
  // legacy(),
]
export default vitePlugins
