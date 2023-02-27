<template>
  <div class="user-info">
    <el-form
      ref="userInfoForm"
      :model="userInfo"
      label-width="120px"
      size="large"
      class="user-info-form"
      :disabled="true"
    >
      <el-form-item label="姓名：" prop="nickname">
        <el-input
          v-model="userInfo.nickname"
          placeholder="请输入姓名"
          :disabled="true"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model.number="userInfo.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input
          v-model="userInfo.email"
          placeholder="请输入邮箱地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="GitHub：" prop="github">
        <el-input
          v-model="userInfo.github"
          placeholder="请输入GitHub地址"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="personalInfo">
import loginApi from '@/api/login'
import { ElMessage } from 'element-plus'
const userInfo = reactive({
  photo: '',
  nickname: '',
  sex: 1,
  email: '',
  github: '',
})
async function init() {
  try {
    const res: any = await loginApi.getUserInfo()
    Object.assign(userInfo, res?.data)
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
init()
</script>

<style lang="scss" scoped>
.user-info {
  width: 100%;
  height: 100%;
  display: flex;
}
.user-info-form {
  width: 520px;
  margin-top: 50px;
}
.upload-icon {
  width: 160px;
  height: 160px;
  color: #dedfe0;
  border: 1px dashed #dedfe0;
  border-radius: 4px;
  cursor: pointer;
}

.upload-icon:hover {
  color: #409eff;
  border-color: #409eff;
  transition: all 0.3s;
}

.avatar {
  border-radius: 6px;
}
</style>
