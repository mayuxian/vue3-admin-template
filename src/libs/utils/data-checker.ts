/**
 * 校验手机号
 * @param {String||Number} phone 手机号
 */
export function isPhone(phone: string) {
  return /^1[3456789]\d{9}$/.test(phone)
}

// /*
//  * @isPhone 验证手机号
//  * */
// export const isPhone = (phone: any) => {
//   // 验证手机号
//   const reg: any =
//     /^(0|86|17951)?(13[0-9]|16[567]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|14[5-9])[0-9]{8}$/
//   if (reg.test(phone)) return true
//   if (!reg.test(phone)) return false
// }

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email: string) {
  const reg =
    /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 判断是否合法网址
 * @param textval 网址
 * @returns
 */
export function isURL(textval: any) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/**
 * 判断汉字
 * @param value 汉字
 * @returns
 */
export function isChn(value: any) {
  const reg = /^[\u4E00-\u9FA5]+$/
  return reg.test(value)
}

/* 身份证号验证 */
export function testId(id: any) {
  id = String(id)
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  const format =
    /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
  // 号码规则校验
  if (!format.test(id)) {
    return false
  }
  // 区位码校验
  // 出生年月日校验  前正则限制起始年份为1900;
  const year = id.substr(6, 4) // 身份证年
  const month = id.substr(10, 2) // 身份证月
  const date = id.substr(12, 2) // 身份证日
  const time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const now_time = Date.parse(Date.now) // 当前时间戳
  const dates = new Date(year, month, 0).getDate() // 身份证当月天数
  if (time > now_time || date > dates) {
    return false
  }
  // 校验码判断
  const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
  const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
  const id_array = id.split('')
  let sum = 0
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(String(c[k]))
  }
  if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return false
  }
  return true
}
