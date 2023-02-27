<template>
  <ListPage
    :request="request"
    :table-columns="tableColumns"
    :filter-fields="filterFields"
    :filter-list-options="filterListOptions"
  >
    <template #columns-append>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="onGoDetail(scope.row)"
            >订单详情</el-button
          >
        </template>
      </el-table-column>
    </template>
  </ListPage>
</template>

<script lang="ts" setup name="orderList">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import listJson from './list.json'

//#region define
const router = useRouter()
//#endregion
//#region reactive data
// eslint-disable-next-line @typescript-eslint/no-empty-function
const bindInit = ref(function () {})
const tableColumns = ref([
  {
    label: '订单编号',
    prop: 'orderNo',
  },
  {
    label: '财务订单编号',
    prop: 'finOrderNo',
  },
  {
    label: '提交时间',
    prop: 'submitDatetime',
  },
  {
    label: '手机号',
    prop: 'telphone',
    // formatter: (row: any, column: any, value: any) => {
    // },
  },
  {
    label: '价格',
    prop: 'money',
  },
  {
    label: '来源',
    prop: 'source',
  },
  {
    label: '状态',
    prop: 'status',
  },
])
const filterFields = ref([
  {
    label: '手机号',
    model: 'telphone',
    componentName: 'el-input',
    componentProps: {
      placeholder: '',
      clearable: true,
      width: '100px',
    },
  },
  {
    label: '来源',
    model: 'source',
    componentName: 'el-select',
    componentProps: {
      placeholder: '',
      clearable: true,
    },
  },
])
const filterListOptions = ref({
  source: [
    { id: 1, label: 'App' },
    { id: 2, label: '腾讯' },
    { id: 3, label: '抖音' },
    { id: 4, label: '线下开单' },
  ],
})
//#endregion
//#region methods
async function request(params: any, pageInit: any) {
  console.log('order list request', params)
  //   init = pageInit //这种方式必须在事件中执行init() 才行
  bindInit.value = pageInit //这种可以直接应用绑定init即可
  //   const res = await adminApi.getUserList(params)
  //   return res?.data
  return {
    list: listJson,
    total: listJson.length,
  }
}
function init() {
  console.log('order list init')
}
init()
//#endregion
//#region events
function onGoDetail(row: any) {
  console.log(row)
  router.push({
    name: 'orderDetail',
    query: {
      orderNo: row.orderNo,
      title: row.orderNo,
    },
  })
}
//#endregion
</script>

<style scoped lang="scss"></style>
