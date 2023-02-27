import { ElMessage } from 'element-plus'
export default {
  install: (app: any, options: any) => {
    return null
    app.config.errorHandler = (err: any, vm: any, info: any) => {
      console.error('vue errorHandler -> message:', err.message)
      console.error('vue errorHandler -> stack:', err.stack)
      //console.error('vue errorHandler -> info', info)
      //dev开发阶段就报错未trycatch捕捉的错误，比如dom绑定错误导致白屏报错问题
      ElMessage.error(err?.message)
    }
    app.config.warnHandler = function (msg: any, vm: any, trace: any) {
      console.warn('vue warnHandler -> msg', msg)
      // console.warn('vue warnHandler -> trace', trace)
      // `trace` is the component hierarchy trace
    }
    window.onerror = function (
      event: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) {
      //   console.error('window.onerror -> event', event)
      //   console.error('window.onerror -> source', source)
      console.error('window.onerror -> error', error)
      //   ElMessage.error(error?.message)
    }
    window.addEventListener(
      'error',
      function (event: any) {
        console.error('window.addEventListener -> event ', event)
        const errMsg = `资源${event.srcElement?.currentSrc || ''}加载失败`
        console.error('window.addEventListener -> error ', errMsg)
        // ElMessage.error(errMsg)
      },
      true
    )
    window.addEventListener(
      'window.addEventListener -> unhandledrejection',
      function (event: any) {
        console.error(`unhandledrejection: ${event.reason}`) //获取到catch的err的原因(内容) 与控制台报错一致
        console.error(`unhandledrejection: ${event.promise}`) //获取到未处理的promise对象
        event.preventDefault()
        ElMessage.error(event.reason)
      }
    )
  },
}
