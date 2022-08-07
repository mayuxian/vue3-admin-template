/**
 * 判断用户名是否符合要求，英文字母与数字组合
 * @param value
 * @returns
 */
export function isValidUsername(value: any) {
  const usernameregex = /^[a-zA-Z0-9]*$/
  return usernameregex.test(value)
}
