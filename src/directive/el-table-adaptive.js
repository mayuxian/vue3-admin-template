/* eslint-disable @typescript-eslint/no-unused-vars */
import { useResizeObserver } from '@vueuse/core'
/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 60}">...</el-table>
 * el-table height is must be set
 * bottomOffset: 60(default)   // The height of the table from the bottom of the page.
 */

const doResize = (el, binding, vnode) => {
  //vue3.0 vnode中没有了componentInstantce属性了
  // const { componentInstance: $table } = vnode
  const tableHeight = el.offsetHeight
  const { value } = binding

  // if (!tableHeight) {
  //   throw new Error(`el-$table must set the height. Such as height='100px'`)
  // }
  const bottomOffset = (value && value.bottomOffset) || 50

  // if (!$table) return
  const height =
    window.innerHeight - el.getBoundingClientRect().top - bottomOffset
  if (!tableHeight || height === tableHeight) return
  // el.style.height = height + 'px'
  // el.style.maxHeight = height + 'px'
  // const ctx = vnode?.ref?.i?.ctx
  // if (ctx) {
  //   ctx.layout && ctx.layout.setMaxHeight && ctx.layout?.setMaxHeight(height)
  //   ctx.doLayout && ctx.doLayout()
  // }
}

const adaptive = {
  beforeMount(el, binding, vnode) {
    // parameter 1 is must be "Element" type
    el.resizeListener = useResizeObserver(window.document.body, entries => {
      doResize(el, binding, vnode)
    })
  },
  updated(el, binding, vnode, oldVnode) {
    // console.log('===', vnode === oldVnode);
    doResize(el, binding, vnode)
  },
  mounted(el, binding, vnode) {
    doResize(el, binding, vnode)
  },
  unmounted(el) {
    el.resizeListener?.stop && el.resizeListener?.stop()
  },
  activated(el, binding, vnode) {
    console.log('el-table-adaptive activated')
    doResize(el, binding, vnode)
  },
  deactivated() {
    console.log('el-table-adaptive deactivated')
    el.resizeListener?.stop && el.resizeListener?.stop()
  },
}
export default {
  install: function (Vue) {
    Vue.directive('el-height-adaptive-table', adaptive)
  },
}
