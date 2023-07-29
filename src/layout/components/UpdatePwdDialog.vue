<template>
  <el-dialog
    title="修改密码"
    :model-value="props.visible"
    width="460px"
    :before-close="onClose"
    destroy-on-close
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="data"
      size="default"
      label-width="100px"
      class="mb10"
      style="max-width: 600px"
    >
      <el-form-item
        label="原密码"
        prop="oldPwd"
        :rules="[{ required: true, message: '请输入原密码' }]"
      >
        <el-input
          v-model.trim="data.oldPwd"
          placeholder="请输入原密码"
          style="width: 90%"
          type="text"
          class="no-autofill-pwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd1" :rules="pwdRule1">
        <el-input
          v-model.trim="data.newPwd1"
          placeholder="字母+数字，10-12位"
          minlength="8"
          style="width: 90%"
          type="text"
          class="no-autofill-pwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd2" :rules="pwdRule2">
        <el-input
          v-model.trim="data.newPwd2"
          placeholder="字母+数字，10-12位"
          style="width: 90%"
          type="text"
          class="no-autofill-pwd"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default" @click="onClose"> 取消</el-button>
        <el-button size="default" type="primary" @click="onSavePwd">
          保存</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import md5 from 'js-md5'
import loginApi from '@/api/login'

const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'submit'])
const formRef = ref()
const router = useRouter()
const props = defineProps({
  visible: Boolean,
})

//#region  define
const pwdCheckRule = {
  validator: (rule: any, value: any, callback: any) => {
    const pwdRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/gi
    if (value.length < 8 || value.length > 12 || !pwdRegex.test(value)) {
      callback(new Error('请输入8-12位字母和数字'))
      return
    } else {
      callback()
    }
  },
  trigger: ['blur'],
}
const pwdRule1 = ref([
  { required: true, message: '请输入新密码' },
  pwdCheckRule,
])
const pwdRule2 = ref([
  { required: true, message: '请输入确认密码' },
  pwdCheckRule,
])
//#endregion
//#region  reactive
const data = reactive({
  oldPwd: '',
  newPwd1: '',
  newPwd2: '',
})

//#endregion
//#region  events
async function onSavePwd() {
  const isPass = await formRef.value?.validate()
  if (!isPass) return
  if (data.newPwd1 != data.newPwd2) {
    ElMessage.error('新密码和确认密码不一致，请重新输入')
    return
  }
  try {
    await loginApi.updatePwd(md5(data.oldPwd), md5(data.newPwd1))
    emit('submit')
    onClose()
    ElMessage.success('密码修改成功')
    setTimeout(async () => {
      // 清除缓存/token等
      await userStore.logout()
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload()
    }, 700)
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
function onClose() {
  emit('update:visible', false)
  data.oldPwd = ''
  data.newPwd1 = ''
  data.newPwd2 = ''
}
//#endregion
</script>

<style scoped lang="scss">
.no-autofill-pwd {
  :deep(.el-input__inner) {
    -webkit-text-security: disc !important;
    -moz-text-security: disc !important;
    -ms-text-security: disc !important;
  }
}
</style>
