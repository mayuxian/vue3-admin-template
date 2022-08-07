//TODO：可本地mock数据，暂未调试
// import mocker from 'mockjs'
const mocker = require('mockjs')
/*
 * warp response
 */
const resWrapData = {
  status: 0,
  statusInfo: {
    global: 'OK',
  },
  data: [],
}

/*
 * 使用mockjs 处理模板数据
 *
 * @param {Object} data mockjs模板
 * @returns {Object} mockjs生成的数据
 */
function warpMockData(data) {
  const body = mocker.mock(data)
  return Object.assign({}, resWrapData, body)
}

// TODO:没有文件数据改变重新响应的功能.开源vue-element-admin中存在
module.exports = function mockServer(req, res, next) {
  const mockFile = req.path.replace(/\/\d+/g, '/0')
  try {
    const mockFn = require(`../mock${mockFile}`)
    setTimeout(() => {
      res.json(warpMockData(mockFn(req, res)))
    }, 300)
    return
  } catch (e) {
    console.log('mockServer Error:', e)
    res.json(resWrapData)
  }
  return next()
}
