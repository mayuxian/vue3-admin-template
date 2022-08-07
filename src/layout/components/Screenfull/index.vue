<template>
  <div>
    <SvgIcon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import screenfull from 'screenfull'
const isFullscreen = ref(false)
init()

function click() {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: 'you browser can not work',
      type: 'warning',
    })
  }
  screenfull.toggle()
}
function change() {
  isFullscreen.value = screenfull.isFullscreen
}
function init() {
  if (screenfull.isEnabled) {
    screenfull.on('change', change)
  }
}
function destroy() {
  if (screenfull.isEnabled) {
    screenfull.off('change', change)
  }
}
onBeforeUnmount(() => {
  destroy()
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
