export const httpStatus: Record<number, string> = {
  //Informational 1xx  信息
  100: 'Continue', //继续
  101: 'Switching Protocols', //交换协议

  //Successful 2xx  成功
  200: 'OK', //OK
  201: 'Created', //创建
  202: 'Accepted', //已接受
  203: 'Non-Authoritative Information', //非权威信息
  204: 'No Content', //没有内容
  205: 'Reset Content', //重置内容
  206: 'Partial Content', //部分内容

  //Redirection 3xx  重定向
  // 300: 'Multiple Choices', //多种选择
  // 301: 'Moved Permanently', //永久移动
  // 302: 'Found', //找到
  // 303: 'See Other', //参见其他
  // 304: 'Not Modified', //未修改
  // 305: 'Use Proxy', //使用代理
  // 306: 'Unused', //未使用
  // 307: 'Temporary Redirect', //暂时重定向

  //Client Error 4xx  客户端错误
  400: 'Bad Request', //错误的请求
  401: 'Unauthorized', //未经授权
  402: 'Payment Required', //付费请求
  403: 'Forbidden', //禁止
  404: '网络请求不存在(Not Found)', //没有找到
  405: 'Method Not Allowed', //方法不允许
  406: 'Not Acceptable', //不可接受
  407: 'Proxy Authentication Required', //需要代理身份验证
  408: 'Request Timeout', //请求超时
  409: 'Conflict', //指令冲突
  410: 'Gone', //文档永久地离开了指定的位置
  411: 'Length Required', //需要Content-Length头请求
  412: 'Precondition Failed', //前提条件失败
  413: 'Request Entity Too Large', //请求实体太大
  414: 'Request-URI Too Long', //请求URI太长
  415: 'Unsupported Media Type', //不支持的媒体类型
  416: 'Requested Range Not Satisfiable', //请求的范围不可满足
  417: 'Expectation Failed', //期望失败

  //Server Error 5xx  服务器错误
  500: '服务器发生错误，请检查服务器(Internal Server Error)', //内部服务器错误
  501: 'Not Implemented', //未实现
  502: '网关错误(Bad Gateway)', //错误的网关
  503: '服务不可用，服务器暂时过载或维护(Service Unavailable)', //服务不可用
  504: '网关超时(Gateway Timeout)', //网关超时
  505: 'HTTP Version Not Supported', //HTTP版本不支持
}
