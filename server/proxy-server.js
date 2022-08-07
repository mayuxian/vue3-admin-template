//TODO：可本地mock数据，暂未调试
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

const mockServer = require('./mock-server')
function proxyServer(req, res, next) {
  // console.log('--------proxy req------------', req)
  //若为XMLHttpRequest,则为ajax请求
  if (
    ['XMLHttpRequest', 'fetch'].includes(req.headers['x-requested-with']) ||
    //识别出文件上传请求,进行代理转发
    (req.headers['content-type'] &&
      req.headers['content-type']
        .toLowerCase()
        .includes('multipart/form-data;'))
  ) {
    if (process.env.ENV === 'mock') {
      console.log('mock -> ' + req.url)
      return mockServer.call(this, req, res, next)
    }
    const proxyUrl = process.env.VUE_APP_BASE_API
    console.log('proxy -> ' + proxyUrl + req.url)
    const cookieDomainRewrite = {}
    cookieDomainRewrite[req.host] = proxyUrl
    return proxy.web(
      req,
      res,
      {
        target: proxyUrl,
        changeOrigin: true,
        // autoRewrite: true,
        headers: {
          host: req.host,
        },
        // hostRewrite: req.host,
        // cookieDomainRewrite: cookieDomainRewrite
        // cookieDomainRewrite: {
        //      "old.domain": "new.domain",
        //   }
      },
      err => {
        console.error(err)
      }
    )
  }
  return next()
}
module.exports = (app, server, compiler) => {
  app.use(proxyServer)
}
