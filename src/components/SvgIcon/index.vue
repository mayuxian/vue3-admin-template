<template>
  <svg
    :class="['svg-icon', $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
import type { CSSProperties } from 'vue'
import { defineComponent, computed } from 'vue'
import 'virtual:svg-icons-register'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const prefixCls = ''
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)

    const getStyle = computed((): CSSProperties => {
      const { size } = props
      let s = `${size}`
      s = `${s.replace('px', '')}px`
      return {
        width: s,
        height: s,
      }
    })
    return { symbolId, prefixCls, getStyle }
  },
})
</script>
<style lang="less" scoped>
.svg-icon {
  // width: 1em;
  // height: 1em;
  display: inline-block;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
