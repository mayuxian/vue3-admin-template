<template>
  <div>
    <ListPage :request="request" :table-columns="tableColumns">
      <template #query-right>
        <el-button
          v-if="permissionStore.getAuths.back_role_add"
          type="primary"
          @click="onAddAuth"
          >添加权限</el-button
        >
      </template>
      <template #columns-append>
        <el-table-column label="操作" width="500" fixed="right">
          <template #default="scope">
            <el-button
              v-if="
                !scope.row.isAdmin && permissionStore.getAuths.back_role_edit
              "
              type="primary"
              link
              @click="onEditAuth(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="
                !scope.row.isAdmin && permissionStore.getAuths.back_role_setAuth
              "
              type="primary"
              link
              @click="onAuthMenu(scope.row)"
              >资源授权</el-button
            >
            <el-button
              v-if="
                !scope.row.isAdmin && permissionStore.getAuths.back_role_delete
              "
              type="danger"
              link
              @click="onDeleteAuth(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ListPage>
    <el-dialog
      v-model="showDialog"
      :title="dialogTitle"
      width="480px"
      @close="showDialog = false"
    >
      <el-form ref="ruleFormRef" label-width="100px" :model="data">
        <el-form-item label="权限名称" prop="name">
          <el-input
            v-model="data.name"
            class="w-450"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="authManage">
import { filterFields, tableColumns } from './config'
import authApi from '@/api/auth'
import { usePermissionStore } from '@/store/modules/permission'
const permissionStore = usePermissionStore()
const router = useRouter()
const ruleFormRef = ref()
const showDialog = ref(false)
const dialogTitle = ref('')
const dialogMode = {
  none: '',
  add: 'add',
  edit: 'edit',
  auth: 'auth',
}
const curDialogMode = ref(dialogMode.none)

const data = reactive({
  id: '',
  name: '',
})

let init = function () {}
const request = async (params: any, pageInit: any) => {
  init = pageInit
  let res = await authApi.getAuthList(params)
  return res?.data
}

async function onAddAuth() {
  dialogTitle.value = '添加权限'
  data.name = ''
  curDialogMode.value = dialogMode.add
  showDialog.value = true
}
async function onEditAuth(row: any) {
  dialogTitle.value = '编辑权限'
  curDialogMode.value = dialogMode.edit
  Object.assign(data, row)
  showDialog.value = true
}
async function onDeleteAuth(row: any) {
  try {
    const message = `您确定要永久删除权限【${row.name}】吗？`
    let confirmRes = await ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    if (confirmRes === 'confirm') {
      try {
        await authApi.deleteAuth(row.id)
        ElMessage.success('删除权限成功')
        init()
      } catch (err: any) {
        ElMessage.error(err?.message)
      }
    }
  } catch (error) {}
}
function onAuthMenu(row: any) {
  router.push({
    name: 'authMenuConfig',
    params: {
      authId: row.id,
    },
  })
}
async function onSubmit() {
  try {
    if (curDialogMode.value === dialogMode.add) {
      await authApi.addAuth(data.name)
      ElMessage.success('添加成功！')
    } else if (curDialogMode.value === dialogMode.edit) {
      await authApi.updateAuth(data.id, data.name)
      ElMessage.success('修改成功！')
    }
    init()
    showDialog.value = false
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
</script>
