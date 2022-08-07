module.exports = {
  // printWidth: 100,
  // 是否给vue中的 <script> and <style>标签加缩进
  vueIndentScriptAndStyle: false,
  quoteProps: 'as-needed',
  insertPragma: false,
  requirePragma: false,
  //在编译器或查看器中,当屏幕放不下时发生的软折行，所以这一参数允许设置为 " never "
  // " always " - 当超出print width（上面有这个参数）时就折行
  // " never " - 不折行
  // " perserve " - 按照文件原样折行 （v1.9.0+）
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',

  // tab缩进大小,默认为2
  tabWidth: 2,
  // 使用tab缩进，默认false
  useTabs: false,
  // 使用分号, 默认true
  semi: false,
  // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  singleQuote: true,
  // none表示无逗号,可选 none|es5|all
  // es5 包括es5中的数组、对象
  // all 包括函数对象等所有可选
  trailingComma: 'es5',
  // 对象中的空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // JSX标签闭合位置 默认false
  // false: <div
  //          className=""
  //          style={{}}
  //       >
  // true: <div
  //          className=""
  //          style={{}} >
  jsxBracketSameLine: true,
  // 在jsx中使用单引号代替双引号
  jsxSingleQuote: false,
  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'avoid',
  // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  ignorePath: '.prettierignore',
  //true开启,false关闭  prettier使用eslint的代码格式进行校验
  eslintIntegration: true,
  //rue开启,false关闭  prettier使用stylelint的代码格式进行校验
  //   stylelintIntegration: true,
  // 结尾是 \n \r \n\r auto
  endOfLine: 'auto',
  wrapAttributes: false,
  // sortAttributes: false
}
