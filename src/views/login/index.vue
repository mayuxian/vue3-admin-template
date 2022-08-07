<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-tabs v-model="tabSelectKey" class="tab-box" defa>
        <el-tab-pane label="密码登录" :name="LoginTypeEnum.account">
          <el-form
            ref="accountLoginForm"
            :model="accountForm"
            :rules="accountFormRules"
            :inline-message="true"
          >
            <el-form-item prop="username">
              <el-input
                v-model="accountForm.username"
                placeholder="请输入用户名"
                autocomplete="on"
                type="text"
                tabindex="1"
                clearable
              >
                <template #prepend>
                  <SvgIcon name="user" />
                </template>
              </el-input>
            </el-form-item>
            <el-tooltip
              v-model:visible="capsTooltip"
              content="大写锁定(Caps lock is On)"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="accountForm.password"
                  placeholder="请输入密码"
                  autocomplete="on"
                  show-password
                  clearable
                  @keyup.enter="onLogin"
                  name="password"
                  tabindex="2"
                  @keyup="checkCapslock"
                  @blur="capsTooltip = false"
                >
                  <template #prepend>
                    <SvgIcon name="password" />
                  </template>
                </el-input>
              </el-form-item>
            </el-tooltip>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="短信登录" :name="LoginTypeEnum.sms">
          <el-form
            ref="smsLoginForm"
            :model="smsForm"
            :rules="smsFormRules"
            :inline-message="true"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="smsForm.phone"
                maxlength="11"
                placeholder="请输入手机号"
                autocomplete="on"
                clearable
              >
                <template #prepend>
                  <SvgIcon name="phone" size="17" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="smsForm.code"
                maxlength="6"
                type="text"
                placeholder="请输入验证码"
                @keyup.enter="onLogin"
              >
                <template #prepend>
                  <SvgIcon name="email" size="16" />
                </template>
                <template #suffix>
                  <div
                    v-if="!smsSendState"
                    class="sms-code-label cursor_pointer"
                    @click="onSendSms"
                    >获取验证码
                  </div>
                  <div v-else class="sms-code-sended"
                    >已发送（{{ countdownTime }}s）</div
                  >
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <div class="agreement">
          <el-checkbox v-model="agreementChecked" style="color: #999999"
            >我已阅读并同意</el-checkbox
          >
          <el-link
            class="agreement-info"
            @click="() => (agreementDialogVisible = true)"
          >
            《{{ protocolName }}》
          </el-link>
        </div>
      </el-tabs>
      <el-button
        :loading="loading"
        type="primary"
        @click="onLogin"
        style="width: 100%; margin-bottom: 30px; letter-spacing: 10px"
        @keyup.enter="onLogin"
        >登 录</el-button
      >
      <el-dialog
        v-model="agreementDialogVisible"
        :title="protocolName"
        :close-on-click-modal="true"
        :center="false"
      >
        <p
          class="dialog-footer"
          style="margin: 20px 24px 0 0; text-align: right"
        >
          <el-button
            type="primary"
            @click="() => (agreementDialogVisible = false)"
            >确 认</el-button
          >
        </p>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import loginApi from '@/api/login'
import encryptor from '@/libs/utils/encryptor'
import { isPhone } from '@/libs/utils/data-checker'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { startCountDownTime } from '@/libs/utils/count-down'
const router = useRouter()
const userStore = useUserStore()
const title = ref('xxx管理系统')
enum LoginTypeEnum {
  sms = 1,
  account = 2,
}
const tabSelectKey = ref(LoginTypeEnum.account)
const smsSendState = ref(false) //false 未发送，true 已发送。
const SMS_TIME = 60
const countdownTime = ref(SMS_TIME)
const loading = ref(false)
const smsLoginForm = ref()
const accountLoginForm = ref()

const agreementDialogVisible = ref(false)
const agreementChecked = ref(true)
const protocolName = 'xxxx协议'

const capsTooltip = ref(false)

const smsFormRules = {
  phone: [
    { required: true, trigger: 'blur', message: '请填写手机号' },
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
  code: [{ required: true, trigger: 'change', message: '请获取短信验证码' }],
}
const accountFormRules = {
  username: [
    { required: true, trigger: 'blur', message: '请填写用户名' },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        callback()
      },
    },
  ],
  password: [{ required: true, trigger: 'change', message: '请填写密码' }],
}
const smsForm = reactive({
  phone: '18600000001',
  code: '123456',
})
const accountForm = reactive({
  username: 'admin',
  password: '123456',
})

//#region  事件
async function onLogin() {
  if (!smsLoginForm?.value || !accountLoginForm?.value) return
  if (!agreementChecked.value)
    return ElMessage.warning('请阅读相关内容并勾选同意')
  if (tabSelectKey.value === LoginTypeEnum.sms) {
    await smsLoginForm.value.validate()
  } else {
    await accountLoginForm.value.validate()
  }
  try {
    if (tabSelectKey.value === LoginTypeEnum.sms) {
      const res = await loginApi.smsLogin(smsForm)
      userStore.setToken(res?.data)
    } else {
      const res = await loginApi.userLogin({
        username: accountForm?.username,
        password: encryptor.sha256AndBase64(accountForm?.password),
      })
      userStore.setToken(res?.data)
    }
    router.push({ path: userStore.preHistory || '/' })
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
async function onSendSms() {
  if (!smsLoginForm.value) return
  await smsLoginForm.value.validateField(['phone'])
  try {
    let timer: any = null
    //验证码无需校验用户是否存在，不存在直接注册登录
    loginApi
      .sendLoginSms({ phone: smsForm.phone })
      .then(() => {
        ElMessage.info('验证码发送成功')
      })
      .catch((err: any) => {
        ElMessage({
          message: err?.message,
          type: 'error',
        })
        clearInterval(timer)
        smsSendState.value = false
        countdownTime.value = SMS_TIME
      })
    smsSendState.value = true
    timer = startCountDownTime(
      SMS_TIME,
      (time: number) => {
        countdownTime.value = time
      },
      () => {
        smsSendState.value = false
        countdownTime.value = SMS_TIME
      }
    )
  } catch (err: any) {
    ElMessage({
      message: err?.message,
      type: 'error',
    })
  }
}
function checkCapslock(e: any) {
  const key = e.key
  capsTooltip.value = key && key.length === 1 && key >= 'A' && key <= 'Z'
}
//#endregion
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;
$defaultColor: #a5a5a5;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-box {
    width: 420px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    :deep(.el-input) {
      display: inline-block;
      height: 47px;
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      .el-input__wrapper {
        box-shadow: 0 0 0 0px !important;
        height: 100%;
        width: calc(100% - 70px);
        vertical-align: top;
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px !important;
        padding: 0px;
        // padding: 12px 5px 12px 15px;
        color: $light_gray;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          // box-shadow: 0px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
      .el-input-group__prepend {
        box-shadow: 0px 0px 0px 0px !important;
        background: transparent;
        color: $dark_gray;
      }
    }
    :deep(.el-form-item__error) {
      font-size: 14px !important;
      margin-top: 2px !important;
    }
  }

  .tab-box {
    :deep(.el-tabs__header) {
      background: #2d3a4b;
      color: #ffffff;
    }
    :deep(.el-tabs__item) {
      color: $defaultColor;
      font-size: 16px;
    }
    :deep(.is-active) {
      color: $theme-color;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .agreement {
    margin: 20px 0 80px 0;
    width: 100%;
    font-size: 12px !important;
    font-weight: 400;
    line-height: 16px;
    vertical-align: text-top;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    white-space: normal;
    .agreement-info {
      color: $theme-color;
      font-size: 12px !important;
      font-weight: 400;
      display: inline-block;
      position: relative;
      vertical-align: top;
    }
    :deep(.el-checkbox) {
      height: 16px !important;
      vertical-align: text-top !important;
    }
    :deep(.el-checkbox__label) {
      font-size: 12px !important;
      vertical-align: text-top !important;
      line-height: 16px !important;
    }
    :deep(.el-checkbox__inner) {
      background-color: $defaultColor;
    }

    :deep(.el-link) {
      display: inline-block;
      vertical-align: text-top !important;
      line-height: 14px !important;
    }
  }

  .sms-code-label {
    font-size: 14px;
    font-weight: 400;
    color: #ff8200;
  }

  .sms-code-sended {
    font-size: 14px;
    font-weight: 400;
    color: #ff8200;
  }
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.el-dialog__footer {
  text-align: center;
}
</style>
