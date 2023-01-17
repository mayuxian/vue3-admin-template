<template>
  <div
    ><DetailHeader title="订单详情" />
    <div class="page-detail-content">
      <DetailCell
        v-for="item in detailConfig"
        :key="item.name"
        :slot-key="item.name"
        :label="item.label"
        style="margin-right: 24px"
        width="336px"
        :text="
          item.formatter ? item.formatter(data[item.name]) : data[item.name]
        "
      />
      <DetailCell label="备注" style="margin-right: 24px">
        <el-input v-model="data.remark" style="width: 500px" />
      </DetailCell> </div
  ></div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import listJson from './list.json'
import DetailHeader from '@/common/DetailHeader.vue'
import DetailCell from '@/common/DetailCell.vue'
//#region define
const route = useRoute()
const detailConfig: any = ref([
  {
    name: 'orderNo',
    label: '订单编号',
  },
  {
    name: 'finOrderNo',
    label: '财务订单编号',
  },
  {
    name: 'submitDatetime',
    label: '提交时间',
  },
  {
    name: 'telphone',
    label: '手机号',
  },
  {
    name: 'money',
    label: '价格',
  },
  {
    name: 'source',
    label: '来源',
  },
  {
    name: 'status',
    label: '状态',
  },
])
//#endregion
//#region reactive data
const data: any = reactive({
  orderNo: '',
  finOrderNo: '',
  submitDatetime: '',
  telphone: '',
  money: 0,
  source: '',
  status: '',
  remark: '',
})
//#endregion
//#region methods
function init() {
  console.log('order detail -> init  route:', route)
  const orderData = listJson.find((x: any) => x.orderNo === route.query.orderNo)
  Object.assign(data, orderData || {})
}
init()
//#endregion
//#region events
//#endregion
</script>

<style scoped lang="scss"></style>
