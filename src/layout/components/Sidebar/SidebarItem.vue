<template>
  <div v-show="!item.hidden">
    <AppLink v-if="onlyOneChild" :to="onlyOneChild.path">
      <el-menu-item
        :index="onlyOneChild.redirect || onlyOneChild.path"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <div><SvgIcon :name="onlyOneChild.meta.icon" /></div>
        <template #title>{{ onlyOneChild.meta.title }}</template>
      </el-menu-item>
    </AppLink>
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <SvgIcon :name="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in itemChildren"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLink from './Link.vue'
export default defineComponent({
  components: {
    AppLink,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const onlyOneChild: any = ref()
    const itemChildren =
      props.item?.children?.filter((item: any) => !item.hidden) || []
    if (!itemChildren?.length) {
      //若没有子菜单了，则显示当前菜单
      onlyOneChild.value = {
        ...props.item,
        path: props.basePath,
      }
    }

    function resolvePath(path: string) {
      const routePath =
        path?.substring(0, 1) === '/' //如果路由有/，表示是使用跟路由方式，不需要连接
          ? path
          : `/${props.basePath.replace(/(.*)[\/\\]/, '$1')}/${path}`
      return routePath
    }
    return { itemChildren, onlyOneChild, resolvePath }
  },
})
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
