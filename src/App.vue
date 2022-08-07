<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
const userStore = useUserStore()
const appStore = useAppStore()
const locale = ref(zhCn)
const size = ref(appStore.getSize)
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
