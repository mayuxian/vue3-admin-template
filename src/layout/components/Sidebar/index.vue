<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- TODO:实现logo -->
    <!-- <Logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="cssVariables.menuBg"
        :text-color="cssVariables.menuText"
        :active-text-color="cssVariables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="item in permissionRoutes"
          :key="item.path"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { usePermissionStore } from '@/store/modules/permission'
import { useSettingsStore } from '@/store/modules/settings'
import { useAppStore } from '@/store/modules/app'
import SidebarItem from './SidebarItem.vue'
// import Logo from './Logo.vue'

// const variables: any = cssVariables
//TODO：先赋值固定变量值
const cssVariables: any = {
  menuBg: '#304156',
  menuText: '#bfcbd9',
  menuActiveText: '#409eff',
  // menuBg: variables.$menuBg,
  // menuText: variables.$menuText,
  // menuActiveText: variables.$menuActiveText,
}
const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const showLogo = computed(() => settingsStore.sidebarLogo)
const activeMenu = computed(() => {
  return route.path
})
const isCollapse = computed(() => !appStore.getSidebarOpened)

const permissionRoutes: any = computed(() => {
  const routes = permissionStore.getRoutes
  return routes
})

if (!permissionRoutes?.length) {
  permissionStore.initRoutesAsync()
}
watch(
  () => permissionStore.getRoutes,
  (newVal: any) => {
    const hasRouteAuth = newVal.find((x: any) => {
      route.path === x.path
    })
    if (!hasRouteAuth) {
      router.push({ path: newVal.at(0)?.path })
    }
  }
)
</script>
<style lang="scss"></style>
