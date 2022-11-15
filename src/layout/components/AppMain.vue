<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition
        name="fade-transform"
        mode="out-in"
        :css="!route.meta.noFade"
        :appear="!route.meta.noFade"
      >
        <KeepAlive v-if="!route.meta.noCache" :exclude="['ListPage']">
          <component :key="route.fullPath" :is="Component"></component>
        </KeepAlive>
        <component v-else :key="route.fullPath" :is="Component"></component>
      </transition>
    </router-view>
    <el-backtop :right="100" :bottom="280" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppMain',
})
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  width: 100%;
  // position: relative;
  // overflow: hidden;
  // padding: 10px 20px;
  // padding-bottom: 80px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
