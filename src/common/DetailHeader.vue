<template>
  <div class="page-detail-header">
    <span class="title">{{ props.title || $route.meta.title }}</span>
    <div style="float: right">
      <el-button class="btn-back" size="small" @click="onBack">返回</el-button>
    </div>
    <el-divider />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const router = useRouter()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  back: {
    type: String,
    default: null,
  },
})
const onBack = () => {
  if (props.back) {
    router.push({ path: props.back })
  } else {
    router.back()
  }
}
</script>

<style scoped lang="scss"></style>
