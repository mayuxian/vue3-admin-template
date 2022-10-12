<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="appStore.getDevice === 'mobile' && appStore.getSidebarOpened"
      class="drawer-bg"
      @click="onHandleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div
      :class="{ hasTagsView: settingsStore.needTagsView }"
      class="main-container"
    >
      <div :class="{ 'fixed-header': settingsStore.canFixedHeader }">
        <Navbar />
        <TagsView v-if="settingsStore.needTagsView" />
      </div>
      <AppMain />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/modules/settings'
import { useAppStore } from '@/store/modules/app'
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import TagsView from './components/TagsView/index.vue'

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const classObj = computed(() => ({
  hideSidebar: !appStore.getSidebarOpened,
  openSidebar: appStore.getSidebarOpened,
  withoutAnimation: appStore.getSidebarWithoutAnimation,
  mobile: appStore.getDevice === 'mobile',
}))

const onHandleClickOutside = () => {
  console.log()
}
</script>
<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
