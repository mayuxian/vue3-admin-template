import { defineConfig, UserConfig } from 'vite'
import { plugins } from './build/index'
import { resolve } from 'path'

export default defineConfig((config: UserConfig) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const isDev = config.mode === 'development'
  const isDevBuild = config.mode === 'devbuild'
  const isTest = config.mode === 'test'
  const isProd = config.mode === 'production'
  /* eslint-enable  */
  return {
    base: isDev ? './' : '/',
    plugins: [...plugins],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          //前置加载提供每个vue页面的全局样式，不如定义了$theme-color，通过这样引用后才可以使用
          additionalData: `@use "@/assets/styles/global.scss" as *;`,
        },
      },
      postcss: {
        plugins: [
          {
            //解决构建包含@charset问题 https://github.com/vitejs/vite/issues/5833
            //或者安装postcss-normalize-charset，应该也可以实现去除charset规则
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
          },
        ],
      },
    },
    build: {
      target: 'esnext', //默认'modules',modules模式Opera、UC、百度浏览器不支持，由于对于移动端，不建议设置modules模式
      assetsInlineLimit: 4096, //默认4096,小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
      cssCodeSplit: true, //默认true, CSS代码拆分
      sourcemap: !isProd,
      minify: 'terser', // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小。'esbuild' 最小化混淆更快但构建后的文件相对更大。
      terserOptions: {
        compress: {
          drop_console: isProd, // 生产环境去除console
          drop_debugger: isProd, // 生产环境去除debugger
        },
      },
      rollupOptions: {
        // 暂未做排除公共库，替换cdn的功能
        // external: ['vue', 'vue-router', 'axios'],
        // plugins: [
        //   externalGlobals({
        //     vue: 'Vue',
        //     'vue-router': 'VueRouter',
        //     axios: 'axios',
        //   }),
        // ],
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: "import { h } from 'vue';",
    },
    server: {
      port: 5005, // 启动端口
      open: false, // 启动后是否打开浏览器。建议关闭，首次打开的页面会热更新，否则每次都会打开新的tab页。
      cors: true, // 允许跨域
      // 本地代理接口
      proxy: {
        // dev环境
        '/api': {
          //TODO:更改为dev环境的后台服务地址
          target: 'http://dev.domain.com',
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, ''),
        },
        // test环境
        // '/api': {
        //   target: 'https://test.domain.com',
        //   changeOrigin: true,
        //   // rewrite: path => path.replace(/^\/api/, ''),
        // },
      },
    },
  }
})
