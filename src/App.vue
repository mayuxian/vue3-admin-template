<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { useCssVar } from '@vueuse/core'
const bgColor = useCssVar(
  '--pc-theme-bg-color',
  window.document.documentElement
)
const activeColor = useCssVar(
  '--pc-theme-active-color',
  window.document.documentElement
)
const hoverColor = useCssVar(
  '--pc-theme-hover-color',
  window.document.documentElement
)
const disabledColor = useCssVar(
  '--pc-theme-disabled-color',
  window.document.documentElement
)

const userStore = useUserStore()
const appStore = useAppStore()
const locale = ref(zhCn)
const size = ref(appStore.getSize)
function init() {
  const toHex = (percent: number) => Math.round(255 * percent).toString(16)
  const themeColor = '#1ab370'
  bgColor.value = themeColor
  hoverColor.value = themeColor + toHex(0.75) // 'bf'  //75%
  activeColor.value = themeColor + toHex(0.5) //'80'  //50%
  disabledColor.value = themeColor + toHex(0.25) //25%
}
//TODO：替换themeColor的主题颜色值可以更改主题色
// init()
watchEffect(() => {
  const token = userStore.getToken
  const userInfo = userStore.getUserInfo
  //已经登录，但没有用户信息时，重新请求
  if (token && !userInfo) {
    userStore.initUserInfo()
  }
})
watch(
  () => appStore.size,
  (newVal: string) => {
    size.value = newVal
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped></style>
