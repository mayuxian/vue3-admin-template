<template>
  <div class="navbar">
    <Hamburger
      id="hamburger-container"
      :is-active="sidebarOpened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />

    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <a
          target="_blank"
          href="https://github.com/mayuxian/vue3-admin-template/"
        >
          <SvgIcon
            name="github-fill"
            size="23"
            class="right-menu-item hover-effect"
        /></a>
        <Screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="设置大小" effect="dark" placement="bottom">
          <SizeSelect id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <PersonalCenter style="line-height: 50px; margin-left: 20px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './Breadcrumb/index.vue'
import Hamburger from './Hamburger/index.vue'
import Screenfull from './Screenfull/index.vue'
import SizeSelect from './SizeSelect/index.vue'
import PersonalCenter from './PersonalCenter.vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const sidebarOpened = computed(() => appStore.sidebar.opened)
const device = computed(() => appStore.device)

function toggleSideBar() {
  appStore.toggleSideBar()
}
</script>

<style lang="scss" scoped>
.hr {
  display: inline-block;
  width: 2px;
  background-color: #606266;
  opacity: 0.6;
  height: 24px;
  margin: 0px 5px;
  vertical-align: middle;
}
.exit {
  color: #606266;
}
.username {
  font-size: 14px;
  color: #606266;
  margin-left: 6px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
