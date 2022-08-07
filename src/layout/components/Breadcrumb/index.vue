<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pathToRegexp, match, parse, compile } from 'path-to-regexp'
const route = useRoute()
const router = useRouter()
const levelList: any = ref(null)
getBreadcrumb()
watch(
  () => route.path,
  (routePath: any) => {
    if (routePath.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  }
)

function getBreadcrumb() {
  // only show routes with meta.title
  let matched: any = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched.at(0)

  if (first?.path !== '/') {
    const homeRoute = router.options?.routes?.find((x: any) => x.path === '/')
    if (homeRoute) {
      matched = [homeRoute].concat(matched)
    }
  }

  levelList.value = matched.filter(
    (item: any) =>
      item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}
function pathCompile(path: any) {
  // var toPath = compile(path, { encode: encodeURIComponent })
  var toPath = compile(path)
  return toPath(route.params)
}
function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(pathCompile(path))
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
