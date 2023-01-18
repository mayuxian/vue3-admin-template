<template>
  <div class="page-box">
    <HeaderQuerier
      v-if="props.filterFields?.length || $slots['query-right']"
      v-model="data.filterParams"
      :field-options="props.filterFields"
      :list-options="props.filterListOptions"
      @query="onQuery"
      @reset="onReset"
    >
      <slot name="query" />
      <template #query-right>
        <slot name="query-right" />
      </template>
    </HeaderQuerier>
    <el-table
      id="listpage_id"
      v-bind="props.tableOptions"
      v-loading="tableLoading"
      :data="data.tableData"
      :max-height="tableMaxHeight"
      style="width: 100%"
      stripe
      border
    >
      <!-- :max-height="tableMaxHeight" -->
      <!-- el-height-adaptive-table -->
      <el-table-column
        v-if="props.options?.selection"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="!props.options?.indexHidden"
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
          :show-overflow-tooltip="
            col.showTooltip ||
            col.showOverflowTooltip ||
            col['show-overflow-tooltip']
          "
          :min-width="col.minWidth || col.width"
          :formatter="col.formatter"
        >
        </el-table-column>
      </template>
      <slot name="columns-append" />
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
</template>

<script lang="ts" setup>
import { useResizeObserver, useThrottleFn } from '@vueuse/core'
import screenfull from 'screenfull'

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
    type: Array<any>,
    default: () => null,
  },
  tableOptions: {
    type: Object,
    default: null,
  },
  options: {
    type: Object,
    default: null,
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
onMounted(() => {
  console.log('ListPage onMounted')
})
onActivated(() => {
  console.log('ListPage onActivated')
})
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
defineExpose({
  init,
})
//#endregion

//#region 表格高度自适应
const tableMaxHeight = ref(window.screen.height - 330)
const throttledFn = useThrottleFn(() => {
  const el: any = document.getElementById('listpage_id')
  if (!el) return
  const height = window.innerHeight - el.getBoundingClientRect().top - 50
  console.log('tableMaxHeight', height)
  tableMaxHeight.value = height
}, 300)

function doResize() {
  throttledFn()
}
onBeforeMount(() => {
  screenfull.on('change', doResize)
  window.addEventListener('resize', doResize)
})
onMounted(() => {
  doResize()
})
onUpdated(() => {
  doResize()
})
onUnmounted(() => {
  screenfull.off('change', doResize)
  window.removeEventListener('resize', doResize)
})
//#endregion
</script>
<style lang="scss" scoped></style>
