<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div> <SvgIcon name="size" /></div>
    <template #dropdown>
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size === item.value"
        :command="item.value"
      >
        {{ item.label }}
      </el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tags-view'
import { ElMessage } from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const sizeOptions = [
  { label: 'Large ', value: 'large' },
  { label: 'Default', value: 'default' },
  { label: 'Small', value: 'small' },
  // { label: 'Mini', value: 'mini' },
]
const size = appStore.getSize
function handleSetSize(size: any) {
  appStore.setApp({
    size: size,
  })
  refreshView()
  ElMessage({
    message: '组件大小切换成功',
    type: 'success',
  })
}
function refreshView() {
  // In order to make the cached page re-rendered
  tagsViewStore.delAllCachedViews()
  nextTick(() => {
    router.replace({
      path: '/redirect' + route.fullPath,
    })
  })
}
</script>
