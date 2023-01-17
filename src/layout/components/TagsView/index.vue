<template>
  <div ref="tagsViewRef" id="tags-view-container" class="tags-view-container">
    <ScrollPane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        :ref="setItemRef"
        :key="tag.fullPath"
        :class="isActive(tag) ? 'active' : ''"
        :to="{
          path: tag.fullPath,
          query: tag.query || {},
          params: tag.params || {},
        }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <el-tooltip
          effect="dark"
          :content="tag.title"
          placement="top"
          :show-after="1000"
        >
          <div class="tags-view-title">{{ tag.title }}</div>
        </el-tooltip>
        <el-icon
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
          ><Close
        /></el-icon>
      </router-link>
    </ScrollPane>
    <ul
      v-show="data.visible"
      :style="{ left: data.left + 'px', top: data.top + 'px' }"
      class="contextmenu"
    >
      <!-- <li @click="refreshSelectedTag(data.selectedTag)">刷新</li> -->
      <li
        v-if="!isAffix(data.selectedTag)"
        @click="closeSelectedTag(data.selectedTag)"
        >关闭</li
      >
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(data.selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
import { useTagsViewStore } from '@/store/modules/tags-view'
import { usePermissionStore } from '@/store/modules/permission'
import ScrollPane from './ScrollPane.vue'
// import path from 'path-browserify'
import { ElMessage, ElMessageBox } from 'element-plus'
const inst: any = getCurrentInstance()
const tagsViewStore = useTagsViewStore()
const permStore = usePermissionStore()
const route = useRoute()
const router = useRouter()
const scrollPane = ref()
const tagsViewRef = ref()
const data = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {},
  affixTags: [],
  tagRefs: new Array<any>(),
})
defineExpose({
  tagRefs: data.tagRefs,
})
const visitedViews = computed(() => tagsViewStore.visitedViews)
let divideId: any = null
watch(
  () => route.path,
  () => {
    addTags()
    // TODO:移动暂时有问题,先注释
    moveToCurrentTag()
  }
)
watch(
  () => data.visible,
  (value: any) => {
    if (value) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  }
)
onMounted(() => {
  initTags()
  addTags()
})
onBeforeUpdate(() => {
  data.tagRefs = []
})
//#region event
function setItemRef(el: any) {
  if (el && !data.tagRefs.includes(el)) {
    data.tagRefs.push(el)
  }
}
function matchObject(leftObj: any, rightObj: any) {
  const leftKeys = Object.keys(leftObj)
  const rightKeys = Object.keys(rightObj)
  if (leftKeys.length != rightKeys.length) return false
  return !leftKeys.some(
    (key: any) => key != 'time' && leftObj[key] !== rightObj[key]
  )
}
function matchRoute(routeItem: any, curRoute: any) {
  if (curRoute?.meta?.divide) {
    return (
      routeItem.name == curRoute.name &&
      matchObject(routeItem.query, curRoute.query) &&
      matchObject(routeItem.params, curRoute.params)
    )
  } else {
    return routeItem.name === curRoute.name || routeItem.path === curRoute.path
  }
  // return curRoute.meta.divide
  //   ? curRoute.fullPath === route.fullPath
  //   : curRoute.name === route.name || curRoute.path === route.path
}
function isActive(curRoute: any) {
  let isActive = matchRoute(route, curRoute)
  if (route.meta.subpage) {
    console.log('divideId', divideId)
    isActive =
      route.path.startsWith(curRoute.path) && divideId == curRoute.query.id
  }
  return isActive
}
function isAffix(tag: any) {
  return tag.meta && tag.meta.affix
}
function filterAffixTags(routes: any, basePath = '/'): [] {
  let tags: any = []
  routes.forEach((route: any) => {
    if (route.meta && route.meta.affix) {
      // const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: route.fullPath,
        path: route.path,
        name: route.name,
        meta: route.meta,
        params: route.params,
        query: route.query,
      })
      // tags.push({
      //   fullPath: tagPath,
      //   path: tagPath,
      //   name: route.name,
      //   meta: { ...route.meta },
      // })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
function initTags() {
  const affixTags: any = (data.affixTags = filterAffixTags(permStore.getRoutes))
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}
function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView(route)
  }
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const tag of data.tagRefs) {
      console.log('moveToCurrentTag tag ', tag)
      console.log('moveToCurrentTag route', route)
      if (tag.to.path === route.fullPath) {
        if (route.meta.divide) {
          divideId = route.query.id //复制当前移动的项目的id
        }
        scrollPane.value?.moveToTarget(tag)
        // when query is different then update
        // if (tag.to.fullPath !== route.fullPath) {
        tagsViewStore.updateVisitedView(route)
        // }
        break
      }
    }
  })
}
function refreshSelectedTag(view: any) {
  //TODO:需要支持右键刷新
  tagsViewStore.delCachedView(view)
  nextTick(() => {
    view.query.time = Date.now().toString()
    router.push({
      // name: view.name,
      path: view.fullPath,
      query: view.query,
      params: view.params,
    })
    tagsViewStore.updateVisitedView(view)
    // tagsViewStore.addCachedView(view)
  })
}
async function closeSelectedTag(view: any) {
  if (view.meta.closeConfirm) {
    await ElMessageBox.confirm(
      '请确认当前页面内容是否保存，否则会导致内容丢失，是否确认离开？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  }
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView(tagsViewStore.getVisitedViews, view)
  }
}
function closeOthersTags() {
  router.push(data.selectedTag)
  tagsViewStore.delOthersViews(data.selectedTag)
  moveToCurrentTag()
}
function closeAllTags(view: any) {
  tagsViewStore.delAllViews()
  if (data.affixTags.some((tag: any) => tag.path === view.path)) {
    return
  }
  toLastView(tagsViewStore.getVisitedViews, view)
}

function toLastView(visitedViews: any, view: any) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
function openMenu(tag: any, e: any) {
  const menuMinWidth = 105
  const el = inst?.ctx?.$el || unref(tagsViewRef)
  const offsetLeft = el?.getBoundingClientRect()?.left // container margin left
  const offsetWidth = el?.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const left = e.clientX - offsetLeft + 15 // 15: margin right

  if (left > maxLeft) {
    data.left = maxLeft
  } else {
    data.left = left
  }

  data.top = e.clientY
  data.visible = true
  data.selectedTag = tag
}
function closeMenu() {
  data.visible = false
}
function handleScroll() {
  closeMenu()
}
//#endregion
</script>

<style lang="scss" scoped>
.tags-view-wrapper {
  .tags-view-title {
    max-width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
  }
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      line-height: 26px;
      border-radius: 50%;
      vertical-align: middle;
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      vertical-align: middle;
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: $theme-color;
        color: #fff;
        border-color: $theme-color;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
a {
  text-decoration: none;
}
</style>
