<template>
  <div class="page-box">
    <HeaderQuerier
      v-model="data.filterParams"
      :field-options="filterFields"
      :list-options="filterListOptions"
      @query="onQuery"
      @reset="onReset"
      style="`position: relative; top: 5px"
    >
      <slot name="query" />
    </HeaderQuerier>
    <div
      :style="`position: relative; float: right;${
        filterFields?.length ? 'top: -42px;' : 'top: -22px;'
      };`"
      ><slot name="query-right"
    /></div>
    <div
      :style="`position: relative;${
        filterFields?.length ? 'top: -25px;' : 'top: -5px;'
      };`"
    >
      <el-table
        v-loading="tableLoading"
        :data="data.tableData"
        stripe
        border
        default-expand-all
        :max-height="tableHeightCalc"
        v-el-height-adaptive-table
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          :index="loadIndex"
        />
        <template v-for="col in tableColumns">
          <slot v-if="$slots[col.prop]" :name="col.prop"> </slot>
          <el-table-column
            v-else
            :key="col.prop"
            :fixed="col.fixed"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :default-sort="col.defaultSort"
            :show-overflow-tooltip="col.showTooltip"
            :min-width="col.minWidth || col.width"
            :formatter="col.formatter"
          >
          </el-table-column>
        </template>
        <slot name="table-columns" />
      </el-table>
      <Pagination
        class="page-pagination"
        :total="pager.total || 0"
        :page-size="pager.size"
        :current-page="pager.current"
        @current-change="onSkipPage"
        @size-change="onSkipSize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  request: {
    type: [Function],
    default: null,
  },
  filterFields: {
    type: Array,
    default: null,
  },
  filterListOptions: {
    type: Object,
    default: null,
  },
  tableColumns: {
    type: Array,
    default: () => null,
  },
})
const createParamsRaw = () => ({
  current: 1,
  pageNum: 1,
  pageSize: 10,
  size: 10,
})
const tableLoading = ref(false)
const data = reactive({
  filterParams: createParamsRaw(),
  tableData: [],
})
const pager = reactive({
  total: 0,
  size: 10,
  current: 1,
})
async function init() {
  try {
    if (!props.request) {
      throw new Error('请配置request请求参数')
    }
    tableLoading.value = true
    const resData = await props.request(data.filterParams, init)
    data.tableData = resData?.list
    pager.total = resData?.total
  } catch (err: any) {
    ElMessage.error(err?.message)
  } finally {
    tableLoading.value = false
  }
}
init()

//#region 事件
function onQuery(params: any) {
  data.filterParams = createParamsRaw()
  Object.assign(data.filterParams, params)
  init()
}
function onReset() {
  data.filterParams = createParamsRaw()
  init()
}
function onSkipPage(pageNum = 1) {
  if (pager.current === pageNum) return
  pager.current = pageNum
  data.filterParams.pageNum = pageNum
  init()
}
function onSkipSize(size = 10) {
  if (pager.size === size) return
  pager.size = size
  data.filterParams.pageSize = size
  data.filterParams.pageNum = 1
  init()
}
function loadIndex(index: number) {
  return pager?.size * (pager.current - 1) + index + 1
}
const tableHeightCalc = ref(window.screen.height - 160)
defineExpose({
  init,
})
//#endregion
</script>
<style lang="scss" scoped></style>
