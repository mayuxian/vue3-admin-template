module.exports = {
  env: {
    node: true,
    // The Follow config only works with eslint-plugin-vue v8.0.0+
    // 'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    // 'eslint:recommended',
    // 'plugin:vue/recommended',
    './auto-import/.eslintrc-auto-import.json',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  /* 优先级低于parse的语法解析配置 */
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest', //默认latest
    sourceType: 'module',
    // ecmaFeatures: {
    //   jsx: true //启用JSX
    // }
  },
  rules: {
    // "off" -关闭规则,"warn" - 开启规则, 使用警告 程序不会退出,"error" - 开启规则, 使用错误 程序退出
    'prettier/prettier': 'off',
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     singleQuote: true,
    //     //默认都是babel的parser，因为prettier和vetur检查冲突，所以配置成flow
    //     parser: 'flow',
    //   },
    // ],
    'vue/script-setup-uses-vars': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/comment-directive': 'off',
    'vue/attributes-order': 'off',
    'vue/first-attribute-linebreak': 'off',
    // 'vue/no-unused-vars': [
    //   'warn',
    //   {
    //     // 允许声明未使用变量
    //     vars: 'local',
    //     // 参数不检查
    //     args: 'none',
    //   },
    // ],
    // '@typescript-eslint/ban-ts-ignore': 'off',
    // '@typescript-eslint/no-explicit-any': 'warn',
    // '@typescript-eslint/no-unused-vars': 'off',

    // '@typescript-eslint/no-var-requires': 'warn',
    // 'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': 'off',

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'import/resolver': {
    //   node: {
    //     extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    //     moduleDirectory: ['node_modules', './src'],
    //   },
    // },
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //     json: 'never',
    //   },
    // ],
  },
}
