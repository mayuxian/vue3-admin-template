<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="480px"
    :before-close="onCancel"
    :destroy-on-close="true"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="data"
      label-width="80px"
      label-position="left"
    >
      <el-form-item prop="username" label="用户名">
        <el-input
          v-model.trim="data.username"
          :placeholder="'请输入'"
          :disabled="isEidtUser"
        />
      </el-form-item>
      <el-form-item prop="phone" label="手机号码">
        <el-input
          v-model.trim="data.phone"
          placeholder="请输入"
          :disabled="isEidtUser"
        />
      </el-form-item>
      <el-form-item prop="nickname" label="姓名">
        <el-input v-model.trim="data.nickname" :placeholder="'请输入'" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="onCancel">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="onSubmit"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import adminApi from '@/api/admin-user'
import { isPhone } from '@/libs/utils'
import { useUserStore } from '@/store/modules/user'
import { isValidUsername } from '@/libs/validate'
const userStore = useUserStore()
const submitLoading = ref(false)
const formRef = ref()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  userInfo: {
    type: Object,
    default: null,
  },
})
let isEidtUser = ref(false)
const title = ref('新增用户')
const emit = defineEmits(['update:visible', 'submit'])

const rules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入用户名',
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (!isValidUsername(value)) {
          callback(new Error('用户名只支持英文和数字'))
        } else if (value?.length < 8 || value?.length > 16) {
          callback(new Error('用户名为8-16位字符'))
        } else {
          callback()
        }
      },
    },
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      validator: null,
      message: '请输入手机号',
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (!isPhone(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      },
    },
  ],
  nickname: [
    {
      required: true,
      trigger: 'blur',
      validator: null,
      message: '请输入姓名',
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('姓名只支持汉字'))
        } else if (value?.length < 2) {
          callback(new Error('姓名位数不能小于2位'))
        } else {
          callback()
        }
      },
    },
  ],
}
const createForm = () => ({
  username: '',
  phone: '',
  nickname: '',
})
const data = reactive(createForm())

const visible = ref(false)
watch(
  () => props.visible,
  (val: boolean) => {
    visible.value = val
  }
)
watch(
  () => props.userInfo,
  (val: any) => {
    isEidtUser.value = !!Object.keys(props.userInfo || {}).length
    title.value = isEidtUser.value ? '编辑用户' : '新增用户'
    data.username = val.username
    data.phone = val.phone
    data.nickname = val.nickname
  }
)

const onCancel = () => {
  visible.value = false
  emit('update:visible', false)
}
const onSubmit = async () => {
  await unref(formRef)?.validate()
  try {
    if (isEidtUser.value) {
      await adminApi.updateUser({
        userId: props.userInfo?.userId,
        nickname: data.nickname,
      })
      if (userStore.userInfo?.userId === props.userInfo?.userId) {
        userStore.setUserInfo({
          nickname: data.nickname,
        })
      }
    } else {
      await adminApi.addUser({
        nickname: data.nickname,
        username: data.username,
        phone: data.phone,
      })
    }
    visible.value = false
    emit('update:visible', false)
    emit('submit')
    ElMessage.success(title.value + '成功')
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
function onSendSms() {
  console.log(11)
}
</script>

<style lang="scss" scoped>
.w-450 {
  :deep(.el-input__suffix) {
    z-index: 2;
  }
}
</style>
