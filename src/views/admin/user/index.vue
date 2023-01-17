<template>
  <div>
    <ListPage
      :request="request"
      :table-columns="tableColumns"
      :filter-fields="filterFields"
      :filter-list-options="filterListOptions"
    >
      <template #query-right>
        <el-button type="primary" @click="onAddUser">添加用户</el-button>
      </template>
      <template #columns-append>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag
              :type="scope.row.state === 1 ? 'success' : 'danger'"
              disable-transitions
              >{{ ['启用', '停用'].at(scope.row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button
              v-if="permissionStore.getAuths.back_user_detail"
              type="primary"
              link
              @click="onGoUserDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="permissionStore.getAuths.back_user_edit"
              type="primary"
              link
              @click="onUpdateUser(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="permissionStore.getAuths.back_user_setRole"
              type="primary"
              link
              @click="onSetRole(scope.row)"
              >角色设置</el-button
            >
            <el-popconfirm
              v-if="permissionStore.getAuths.back_user_startstop"
              :title="`此操作将重置该用户密码为123456，是否继续?`"
              @confirm="onResetPwd(scope.row)"
            >
              <template #reference>
                <el-button type="primary" link>重置密码</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="permissionStore.getAuths.back_user_startstop"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :title="`你确定要${scope.row.state === 0 ? '启用' : '停用'}吗?`"
              @confirm="onUpdateStatus(scope.row)"
            >
              <template #reference>
                <el-button type="primary" link>{{
                  scope.row.state === 0 ? '启用' : '停用'
                }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </ListPage>
    <UpsertUserDialog
      v-model:user-info="data.selectUserInfo"
      v-model:visible="updateVisible"
      @submit="onReload"
    ></UpsertUserDialog>
    <SetRoleDialog
      v-model:visible="roleDialogVisible"
      :data="data.selectUserInfo"
      @submit="bindInit"
    />
  </div>
</template>

<script lang="ts" setup name="adminUser">
import { filterFields, tableColumns } from './config'
import adminApi from '@/api/admin-user'
import UpsertUserDialog from './UpsertUserDialog.vue'
import SetRoleDialog from './SetRoleDialog.vue'
import { usePermissionStore } from '@/store/modules/permission'
const permissionStore = usePermissionStore()
const router = useRouter()
const updateVisible = ref<boolean>(false)
const roleDialogVisible = ref(false)
const data = reactive({
  selectUserInfo: {},
})
// eslint-disable-next-line @typescript-eslint/no-empty-function
let init = function () {}
const bindInit = ref(function () {})
const request = async (params: any, pageInit: any) => {
  init = pageInit //这种方式必须在事件中执行init() 才行
  bindInit.value = pageInit //这种可以直接应用绑定init即可
  const res = await adminApi.getUserList(params)
  return res?.data
}
const filterListOptions = ref({
  state: [
    { id: 1, label: '启用' },
    { id: 0, label: '停用' },
  ],
})

//#region 事件
//重点：建议使用function定义函数
//因为箭头函数不存在变量提升，即定义时需要注意定义顺序，否则可能会造成调用时还未定义
async function onUpdateStatus(row: any) {
  try {
    //启用，停用转换 //1：启用；0：停用
    const newState = row.state === 0 ? 1 : 0
    await adminApi.updateUserStatus({
      userId: row.userId,
      state: newState,
    })
    row.state = newState

    ElMessage.success({ 0: '停用', 1: '启用' }[newState] + '成功')
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
function onGoUserDetail(row: any) {
  router.push({
    name: 'adminDetail',
    query: {
      userid: row.id,
    },
  })
}
function onUpdateUser(row: any) {
  data.selectUserInfo = row
  updateVisible.value = true
}
function onSetRole(row: any) {
  data.selectUserInfo = row
  roleDialogVisible.value = true
}

function onAddUser() {
  data.selectUserInfo = {}
  updateVisible.value = true
}
function onReload() {
  init()
}
async function onResetPwd(row: any) {
  try {
    await adminApi.resetPassword(row.userId)
    ElMessage.success('重置密码成功')
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
//#endregion
</script>

<style scoped lang="scss"></style>
