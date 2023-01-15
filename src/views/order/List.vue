<template>
  <div>
    <h1>订单列表</h1>
    <ListPage
      :request="request"
      :table-columns="tableColumns"
      :filter-fields="filterFields"
      :filter-list-options="filterListOptions"
    >
    </ListPage>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

//#region define
//#endregion
//#region reactive data
// eslint-disable-next-line @typescript-eslint/no-empty-function
const bindInit = ref(function () {})
const tableColumns = ref([])
const filterFields = ref([])
const filterListOptions = ref({
  state: [
    { id: 1, label: '启用' },
    { id: 0, label: '停用' },
  ],
})
//#endregion
//#region methods
async function request(params: any, pageInit: any) {
  //   init = pageInit //这种方式必须在事件中执行init() 才行
  bindInit.value = pageInit //这种可以直接应用绑定init即可
  //   const res = await adminApi.getUserList(params)
  //   return res?.data
  return []
}
//#endregion
//#region events
//#endregion
</script>

<style scoped lang="scss"></style>
