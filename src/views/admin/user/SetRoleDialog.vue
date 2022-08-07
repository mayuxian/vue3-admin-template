<template>
  <el-dialog
    :model-value="visible"
    title="角色设置"
    width="680px"
    :before-close="onClose"
  >
    <el-form label-width="80px" label-position="left">
      <el-form-item label="用户名">
        <el-input :model-value="data.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色选择">
        <el-checkbox-group
          v-model="state.currentAuths"
          style="max-height: 400px"
          class="el-checkbox-box"
        >
          <el-checkbox
            v-for="item in state.dataAuths"
            :key="item.id"
            :label="item.id"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="upLoading" type="primary" @click="onSubmit"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import adminApi from '@/api/admin-user'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emit = defineEmits(['update:visible', 'submit'])

const upLoading = ref<boolean>(false)
const state: any = reactive({
  dataAuths: [],
  currentAuths: [],
})
const onClose = () => {
  emit('update:visible', false)
}
const onSubmit = async () => {
  if (upLoading.value || state.currentAuths.length === 0) {
    ElMessage.error('角色授权不能为空！')
    return
  }
  try {
    upLoading.value = true
    await adminApi.setUserRole(props.data.userId, state.currentAuths)
    upLoading.value = false
    onClose()
    emit('submit')
    ElMessage.success('角色授权成功')
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}

const initRoleList = async () => {
  try {
    const res = await adminApi.getUserRoleList(props.data.userId)
    const arr = res.data
    state.dataAuths = arr

    state.currentAuths = arr
      .filter((item: any) => {
        return item.checked
      })
      .map((item: any) => {
        return item.id
      })
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}

watch(
  () => props.visible,
  (newVal: boolean) => {
    if (newVal) {
      state.currentAuths = []
      initRoleList()
    }
  }
)
</script>

<style scoped lang="scss">
.el-checkbox-box {
  width: 100%;
  overflow-y: scroll;
  :deep(label.el-checkbox) {
    min-width: 100px;
  }
}
</style>
