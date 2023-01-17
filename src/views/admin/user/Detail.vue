<template>
  <div>
    <DetailHeader title="用户详情" />
    <div class="page-detail-content">
      <DetailCell
        v-for="item in detailConfig"
        :key="item.key"
        :slot-key="item.key"
        :label="item.label"
        style="margin-right: 24px"
        width="336px"
        :text="item.formatter ? item.formatter(data[item.key]) : data[item.key]"
      >
        <template #state>
          <span>自定义state字段slot, 值：{{ data.state }}</span>
        </template>
      </DetailCell>
      <br />
    </div>
  </div>
</template>
<script setup lang="ts" name="adminDetail">
import userApi from '@/api/admin-user'
import { detailConfig } from './detail.config'
const route = useRoute()
const userId = route.params.userid || route.query.userid
const data: any = reactive({
  username: '',
  nickname: '',
  phone: '',
  age: 0,
  sex: 0,
  roles: '',
  state: null,
})
//重点：建议使用function定义函数
//因为箭头函数不存在变量提升，即定义时需要注意定义顺序，否则可能会造成调用时还未定义
async function init() {
  try {
    const res: any = await userApi.getUserDetail(userId?.toString())
    Object.assign(data, res.data || {})
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
init()
</script>

<style scoped lang="scss">
.detail-state-authed {
  color: #1890ff;
}
.detail-state-unauth {
  color: #ff8200;
}
:deep(.el-image) {
  width: 160px;
  height: 90px;
  border: 1px solid #dcdfe6;
}
</style>
