<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <el-avatar :src="userPhoto" :size="32" fit="contain">
        <SvgIcon name="avatar" style="width: 32px; height: 32px" />
      </el-avatar>
      <div class="user_name">{{
        userStore.getUserInfo?.nickname || '用户名'
      }}</div>
      <el-icon class="el-icon--right">
        <arrow-down class="icon-arrow" />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="menu in menuList"
          :key="menu.name"
          :to="menu.link"
          :divided="menu.divided"
          @click="routerChange(menu)"
          >{{ menu.title }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
const router = useRouter()
const userStore = useUserStore()

const userPhoto = computed(() => userStore.getUserInfo?.photo)

const menuList = reactive([
  { title: '首页', link: '/', divided: false },
  { title: '个人信息', link: '/personal/info', divided: false },
  { title: '退出', name: 'exit', link: '/login', divided: true },
])

const routerChange = (menu: any) => {
  if (menu.name === 'exit') {
    logout(menu.link)
    return
  }
  router.push({ path: menu.link })
}

const logout = async (url: string) => {
  try {
    await userStore.logout()
  } catch (err: any) {
    ElMessage.error(err?.message)
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown {
  margin-right: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.user-photo {
  border-radius: 50%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
}
.user_name {
  padding-left: 10px;
  font-weight: 500;
  color: #333333;
}
</style>
