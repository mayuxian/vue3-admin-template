<template>
  <div class="page-box">
    <HeaderQuerier
      v-if="props.filterFields?.length || $slots['query-right']"
      v-model="data.filterParams"
      :form-props="props.filterProps"
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
    <slot name="query-bottom" />
    <div style="overflow-y: auto">
      <el-table
        id="listpage_id"
        ref="listPageRef"
        v-bind="props.tableOptions"
        v-loading="tableLoading"
        :data="data.tableData"
        :max-height="tableMaxHeight"
        :highlight-current-row="true"
        style="width: 100%"
        stripe
        border
        @expand-change="onExpand"
      >
        <slot name="columns-head" />
        <!-- :height="tableMaxHeight" -->
        <el-table-column
          v-if="props.options?.selection"
          type="selection"
          fixed="left"
          width="55"
        />
        <el-table-column
          v-if="!props.options?.indexHidden"
          type="index"
          label="序号"
          width="60"
          fixed="left"
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
    </div>
    <Pagination
      class="page-pagination"
      :total="pager.total || 0"
      :page-size="pager.size"
      :current-page="pager.current"
      @current-change="onSkipPage"
      @size-change="onSkipSize"
      v-bind="pagerOptions"
    />
  </div>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import screenfull from 'screenfull'
import Pagination from '@/common/Pagination/index.vue'
const emit = defineEmits(['expand-change'])
const props = defineProps({
  request: {
    type: [Function],
    default: null,
  },
  filterProps: {
    type: Object,
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
  pagerOptions: {
    type: Object,
    default: null,
  },
})
const createParamsRaw = () => ({
  pageNo: 1,
  pageSize: 10,
})
const tableLoading = ref(false)
const listPageRef = ref()
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
    data.tableData = resData?.list || []
    pager.total = resData?.total
  } catch (err: any) {
    ElMessage.error(err?.message)
  } finally {
    tableLoading.value = false
  }
}
init()
function onExpand() {
  emit('expand-change', ...arguments)
}
onBeforeMount(() => {
  screenfull.on('change', doResize)
  window.addEventListener('resize', doResize)
  doResize()
})
onMounted(() => {
  // doResize()
})
// onUpdated(() => {})
onUnmounted(() => {
  screenfull.off('change', doResize)
  window.removeEventListener('resize', doResize)
})
onActivated(() => {
  // console.log('ListPage onActivated')
  doResize()
})
//#region 事件
function onQuery(params: any) {
  data.filterParams = createParamsRaw()
  Object.assign(data.filterParams, params)
  pager.current = 1
  data.filterParams.pageNo = 1
  data.filterParams.pageSize = pager.size
  init()
}
function onReset() {
  data.filterParams = createParamsRaw()
  pager.current = 1
  data.filterParams.pageNo = 1
  data.filterParams.pageSize = pager.size
  init()
}
function onSkipPage(pageNo = 1) {
  if (pager.current === pageNo) return
  pager.current = pageNo
  data.filterParams.pageNo = pageNo
  init()
}
function onSkipSize(size = 10) {
  if (pager.size === size) return
  pager.size = size
  data.filterParams.pageSize = size
  pager.current = 1
  data.filterParams.pageNo = 1
  init()
  doResize()
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
const tableHeight = ref()
const throttledFn = useThrottleFn(() => {
  const el: any =
    listPageRef.value?.$el || document.getElementById('listpage_id')
  if (!el) return
  nextTick(() => {
    // setTimeout(() => {
    let height = window.innerHeight - el.getBoundingClientRect().top - 50
    // height = Math.floor(height)
    tableHeight.value = listPageRef.value.$el.clientHeight
    // console.log('tableMaxHeight', height)
    // console.log('tableHeight', tableHeight.value)
    // ElMessage.warning(
    //   `tableMaxHeight:${height}  tableHeight:${tableHeight.value}`
    // )
    tableMaxHeight.value = height
    listPageRef.value?.doLayout()
    // }, 300)
  })
}, 300)

function doResize() {
  throttledFn()
}
//#endregion
</script>
<style lang="scss" scoped></style>
