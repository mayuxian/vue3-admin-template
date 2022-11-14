import axios, { AxiosRequestConfig } from 'axios'
import router from '@/router/index'
import { httpStatus } from './http-status'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.common['Remote-Host'] =
  import.meta.env.VITE_APP_BASE_DOMAIN || window.location.hostname
const http = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_API}`,
  timeout: 60 * 1000,
})

// 请求拦截器
http.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    config.data = obj2Params(config.data)
    config.params = obj2Params(config.params)
    if (config.headers) {
      const userStore = useUserStore()
      config.headers.Authorization = userStore.getToken
    }
    return config
  },
  error => {
    console.log(error.data.error.message)
    return Promise.reject(error.data.error.message)
  }
)

http.interceptors.response.use(
  response => {
    const status = response.status
    const resData = response.data
    if (status === 200) {
      //TODO:需要更改登录失效的code码
      if (resData.code === 210) {
        ElMessage.warning('登录失效，请重新登录')
        // token失效
        const userStore = useUserStore()
        userStore.removeToken()
        router.push({ path: '/login' })
        return
      } else if (resData?.code !== 200) {
        //通信异常
        const { msg, message, ...resResult } = resData
        return Promise.reject({
          ...resResult,
          message: msg || message,
        })
      } else {
        return resData
      }
    } else if (httpExceptionHandler(response)) {
      //已处理，暂时不返回数据，不响应
    } else {
      console.error('接口返回错误：', response)
      return Promise.reject(response)
    }
  },
  function (error) {
    // http 错误码处理    console 待换成集成UI的弹出提示
    console.error('axios接口返回错误：', error)
    return Promise.reject(error)
  }
)
const httpExceptionHandler = (response: any): boolean => {
  const msg = httpStatus[response.status]
  if (msg) {
    console.error(response)
    // TODO: 处理断网的情况
    // eg:请求超时或断网时，更新state的network状态
    // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    // store.commit('changeNetwork', false)
    return true //已处理
  }
  return false //未处理
}
export default http

//过滤掉值为空的字段
function obj2Params(params: any) {
  if (!params || Array.isArray(params)) return params
  const reqParams: any = {}
  Object.keys(params || {}).forEach((key: any) => {
    const val = params[key]
    if (val === 0 || val) {
      reqParams[key] = val
    } else {
      //为空值的则应该设置null，则通信请求会过滤此字段。或者添加此参数。
      // reqParams[key] = null
    }
  })
  return reqParams
}
