module.exports = {
  plugins: [
    // 兼容和统一跨浏览器的基本样式
    require('postcss-normalize'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('autoprefixer')({
      //已在.browserslintrc中定义。此处定义会覆盖
      // overrideBrowserslist: [
      // ],
      /** should Autoprefixer add IE 10-11 prefixes for Grid Layout properties */
      grid: true,
    }),
    require('postcss-flexbugs-fixes'),
    //若修改为移动端模板，可以应用移动端适配兼容创建插件
    // require('postcss-pxtorem')({
    //   propList: ['*'],
    // }),
  ],
}
