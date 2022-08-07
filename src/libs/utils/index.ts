export * from './data-checker'
export * from './type-checker'
export * from './count-down'

import { isPromise } from './type-checker'
import { ElMessage } from 'element-plus'

export function trycatchHandling(fn: any, ...args: any) {
  let res
  try {
    res = args?.length ? fn(...args) : fn()
  } catch (err: any) {
    ElMessage?.error(err?.message)
    throw new Error(err.message)
  }
  return res
}

export function trycatchAsyncHandling(fn: any, ...args: any) {
  const res = trycatchHandling(fn, ...args)
  if (res && isPromise(res)) {
    res.catch(err => {
      ElMessage?.error(err?.message)
    })
  }
  return res
}
