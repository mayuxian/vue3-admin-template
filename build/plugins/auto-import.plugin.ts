import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from 'vite-plugin-style-import'
// import vueSetupExtend from 'vite-plugin-vue-setup-extend' //支持<script lang="ts" setup name="App">
//https://juejin.cn/post/7012446423367024676
//使用 'vite-plugin-style-import'？

export default [
  AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    sourceMap: true,
    eslintrc: {
      enabled: false,
      filepath: './auto-import/.eslintrc-auto-import.json',
      globalsPropValue: true,
    },
    imports: [
      'vue',
      'vue-router',
      // {
      //   vuex: ['useStore'],
      // },
    ],
    resolvers: [ElementPlusResolver()],
    dts: './auto-import/auto-import.d.ts',
  }),
  Components({
    dirs: ['src/components', 'src/common'],
    // 搜索子目录
    deep: true,
    extensions: ['vue', 'js', 'jsx', 'ts', 'tsx'],
    include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass',
      }),
    ],
    // 允许子目录作为组件的命名空间前缀。
    // directoryAsNamespace: false,
    dts: './auto-import/components.d.ts',
  }),
  // vueSetupExtend(),
  createStyleImportPlugin({
    resolves: [ElementPlusResolve()],
    // libs: [
    //   // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
    //   {
    //     libraryName: 'ant-design-vue',
    //     esModule: true,
    //     resolveStyle: (name) => {
    //       return `ant-design-vue/es/${name}/style/index`
    //     },
    //   },
    // ],
  }),
]
