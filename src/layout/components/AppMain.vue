<template>
  <section class="app-main">
    <!-- 缓冲 -->
    <router-view v-slot="{ Component, route }">
      <transition
        :key="route"
        name="fade-transform"
        mode="out-in"
        :css="!route.meta.noAppear"
        :appear="!route.meta.noAppear"
      >
        <keep-alive v-if="route.meta.keepalive">
          <div :key="route.name">
            <component :is="Component"></component>
          </div>
        </keep-alive>
        <!-- 无缓冲 -->
        <div v-else :key="route.name">
          <component :is="Component"></component>
        </div>
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
