<template>
  <div>
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
  //   init = pageInit //这种方式必须在事件中执行init() 才行
  bindInit.value = pageInit //这种可以直接应用绑定init即可
  //   const res = await adminApi.getUserList(params)
  //   return res?.data
  return [
    {
      orderNo: '165679134966',
      finOrderNo: '26548365981', //财务订单标号
      submitDatetime: '2022年10月1日',
      telphone: '13200000001',
      money: 100.5,
      source: '线下开单', //订单来源  xxApp,线下开单
      status: '已完成', //代付款，已完成，已取消
    },
    {
      orderNo: '165679131010',
      finOrderNo: '97144698367', //财务订单标号
      submitDatetime: '2022年10月2日',
      telphone: '13200000002',
      money: 99,
      source: '腾讯视频', //订单来源  xxApp,线下开单
      status: '待付款', //待付款，已完成，已取消
    },
    {
      orderNo: '165679132318',
      finOrderNo: '36257895123', //财务订单标号
      submitDatetime: '2022年10月3日',
      telphone: '13200000003',
      money: 121,
      source: '抖音', //订单来源  xxApp,线下开单
      status: '已取消', //代付款，已完成，已取消
    },
  ]
}
//#endregion
//#region events
//#endregion
</script>

<style scoped lang="scss"></style>
