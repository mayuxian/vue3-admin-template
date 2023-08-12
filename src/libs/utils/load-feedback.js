/*
 * 遇到返回脚本为空的情况, 导致页面白屏, 这里做了下处理
 * 这段代码直接放到页面的最最底部即可
 */
window.addEventListener(
  'load',
  function () {
    if (!window.Vue) {
      // 给用户一个错误反馈，避免白屏
      var html = [
        '<div class="bendi-component-blank" style="position:absolute;top:50%;-webkit-transform:translate(0, -50%);transform:translate(0, -50%);width:100%;">',
        '<i class="bendi-blankpng bendi-blankpng-02"></i>',
        '<div class="bendi-component-blank__caption">加载失败</div>',
        '<div class="bendi-unit-button" onclick="javascript:window.location.reload();">刷新重试</div>',
        '</div>',
      ]
      document.getElementById('app').innerHTML = html.join('')
    }
  },
  false
)
