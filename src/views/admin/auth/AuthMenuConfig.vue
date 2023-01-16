<template>
  <div class="tree-container">
    <div class="top">
      权限配置
      <div>
        <el-button plain type="success" @click="setCheckedAll">全选</el-button>
        <el-button plain type="info" @click="resetChecked">取消全选</el-button>
        <el-button :loading="upLoading" type="primary" @click="onSubmit"
          >保存设置</el-button
        >
        <el-button @click="$router.back()" style="margin-left: 50px"
          >返回</el-button
        >
      </div>
    </div>
    <el-divider />
    <el-tree
      class="main-box"
      ref="treeRef"
      :data="data.dataTree"
      show-checkbox
      default-expand-all
      node-key="menuKey"
      highlight-current
      :props="{
        children: 'children',
        label: 'label',
      }"
    />
  </div>
</template>

<script lang="ts" setup name="authMenuConfig">
import authApi from '@/api/auth'
const route = useRoute()

let allMenuKey: [] = []
let checkedArr: any = []
let upLoading = ref(false)
const treeRef = ref()
const authId = route.params.authId?.toString()

const data = reactive({
  dataTree: Array<any>([]),
})

const setCheckedKeys = (val: any) => {
  treeRef.value!.setCheckedKeys(val, false)
}
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}
const setCheckedAll = () => {
  setCheckedKeys(allMenuKey)
}

function initMenuTreeKey(data: any, parentId = '', type = '') {
  data?.forEach((x: any) => {
    if (!parentId) {
      allMenuKey.push(x.id)
    }
    x.menuKey = `${parentId ? parentId + '-' : ''}${type}${x.id}`
    if (x.checked) {
      checkedArr.push(x.menuKey)
    }
    if (x.children?.length) {
      initMenuTreeKey(x.children, x.menuKey)
    }
    if (x.buttons?.length) {
      x.children = x.buttons
      delete x.buttons
      initMenuTreeKey(x.children, x.menuKey, 'btn')
    }
  })
}

async function initMenuList() {
  try {
    const res = await authApi.getAuthMenuList(authId)
    initMenuTreeKey(res.data)
    console.log('initmenu ', res.data)
    setCheckedKeys(checkedArr)
    data.dataTree = res.data
  } catch (err: any) {
    ElMessage.error(err.message)
  }
}
initMenuList()

async function onSubmit() {
  const menus = getCheckedKeys()
  if (!menus?.length) return
  upLoading.value = true
  try {
    //TODO:根据接口转换数据
    const params: any = {
      authId: authId,
    }
    await authApi.setAuthMenuList(params)
    upLoading.value = false
    ElMessage.success('操作成功')
  } catch (err: any) {
    ElMessage.error(err.message)
  }
}

function getCheckedKeys() {
  const keys = treeRef.value!.getCheckedKeys(false)
  console.log('select menus ', keys)
  if (keys?.length === 0) {
    ElMessage.error('至少选择一项！')
    return []
  }
  return keys
}
</script>

<style scoped lang="scss">
.main-box {
  padding: 20px;
  background: #ffffff;
}
.top {
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
