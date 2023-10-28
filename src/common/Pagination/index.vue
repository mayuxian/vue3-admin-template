<template>
  <el-pagination
    v-model:current-page="curPage"
    v-model:page-size="curPageSize"
    :layout="props.layout"
    :page-sizes="[10, 20, 30, 50]"
    :total="props.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { scrollTo } from '@/libs/utils/scroll-to'
const emit = defineEmits([
  'update:currentChange',
  'update:sizeChange',
  'pagination',
])
const props = defineProps({
  total: {
    type: Number,
    default: null,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next',
  },
  pageSizes: {
    type: Array,
    default: null,
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
})
const curPage = computed({
  get() {
    return props.currentPage
  },
  set(val: any) {
    emit('update:currentChange', val)
  },
})
const curPageSize = computed<number>({
  get() {
    return props.pageSize
  },
  set(val) {
    emit('update:sizeChange', val)
  },
})

function handleSizeChange(val: any) {
  emit('pagination', { page: curPage, pageSize: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val: any) {
  emit('pagination', { page: val, pageSize: curPageSize })
  if (props.autoScroll) {
    // scrollTo(0, 800)
  }
}
</script>

<style lang="scss" scoped></style>
