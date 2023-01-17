<template>
  <div>
    <ListPage :request="request" :table-columns="tableColumns">
      <template #query-right>
        <el-button
          v-if="permissionStore.getAuths.back_role_add"
          type="primary"
          @click="onAddRole"
          >添加角色</el-button
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
              @click="onEditRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="
                !scope.row.isAdmin && permissionStore.getAuths.back_role_setAuth
              "
              type="primary"
              link
              @click="onRoleAuth(scope.row)"
              >角色授权</el-button
            >
            <el-button
              v-if="
                !scope.row.isAdmin && permissionStore.getAuths.back_role_delete
              "
              type="danger"
              link
              @click="onDeleteRole(scope.row)"
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
        <el-form-item label="角色名称:" prop="name">
          <el-input
            v-model="data.name"
            :disabled="curDialogMode === dialogMode.auth"
            class="w-450"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="角色授权:"
          v-if="curDialogMode === dialogMode.auth"
        >
          <el-checkbox-group v-model="selectAuths" class="el-checkbox-flex">
            <el-checkbox
              v-for="item in data.authList"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
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

<script lang="ts" setup name="roleManage">
import { filterFields, tableColumns } from './config'
import roleApi from '@/api/role'
import { usePermissionStore } from '@/store/modules/permission'
const permissionStore = usePermissionStore()

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
  authList: [],
})
const selectAuths = ref([])

let init = function () {}
const request = async (params: any, pageInit: any) => {
  init = pageInit
  let res = await roleApi.getRoleList(params)
  return res?.data
}

async function onAddRole() {
  dialogTitle.value = '添加角色'
  data.name = ''
  curDialogMode.value = dialogMode.add
  showDialog.value = true
}
async function onEditRole(row: any) {
  dialogTitle.value = '编辑角色'
  curDialogMode.value = dialogMode.edit
  Object.assign(data, row)
  showDialog.value = true
}
async function onRoleAuth(row: any) {
  dialogTitle.value = '角色授权'
  curDialogMode.value = dialogMode.auth
  Object.assign(data, row)
  try {
    const res: any = await roleApi.getRoleAuthList(row.id)
    data.authList = res?.data
    showDialog.value = true
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
async function onDeleteRole(row: any) {
  try {
    const message = `您确定要永久删除角色【${row.name}】吗？`
    let confirmRes = await ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    if (confirmRes === 'confirm') {
      try {
        await roleApi.deleteRole(row.id)
        ElMessage.success('删除角色成功')
        init()
      } catch (err: any) {
        ElMessage.error(err?.message)
      }
    }
  } catch (error) {}
}

//弹窗确认
async function onSubmit() {
  try {
    if (curDialogMode.value === dialogMode.add) {
      await roleApi.addRole(data.name)
      ElMessage.success('添加成功！')
    } else if (curDialogMode.value === dialogMode.edit) {
      await roleApi.updateRole({
        id: data.id,
        roleName: data.name,
      })
      ElMessage.success('修改成功！')
    } else if (curDialogMode.value === dialogMode.auth) {
      const params = {
        authIdList: selectAuths.value,
        roleId: data.id,
      }
      await roleApi.setRoleAuth(params)
      ElMessage.success('角色授权成功!')
    }
    init()
    showDialog.value = false
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
</script>

<style scoped lang="scss"></style>
