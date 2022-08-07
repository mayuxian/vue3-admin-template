<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        :ref="setItemRef"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, params: tag.params }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
          ><Close
        /></el-icon>
        <!-- <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        /> -->
      </router-link>
    </scroll-pane>
    <ul
      v-show="data.visible"
      :style="{ left: data.left + 'px', top: data.top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(data.selectedTag)">刷新</li>
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
import path from 'path'
const inst: any = getCurrentInstance()
const tagsViewStore = useTagsViewStore()
const permStore = usePermissionStore()
const route = useRoute()
const router = useRouter()
const scrollPane = ref()
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
function isActive(curRoute: any) {
  return curRoute.path === route.path
}
function isAffix(tag: any) {
  return tag.meta && tag.meta.affix
}
function filterAffixTags(routes: any, basePath = '/'): [] {
  let tags: any = []
  routes.forEach((route: any) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
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
  // if (route.name) {
  if (route.meta.title) {
    tagsViewStore.addView(route)
  }
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const tag of data.tagRefs) {
      if (tag.to.path === route.path) {
        scrollPane.value?.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route)
        }
        break
      }
    }
  })
}
function refreshSelectedTag(view: any) {
  tagsViewStore.delCachedView(view)
  nextTick(() => {
    router.replace({
      path: '/redirect' + view.fullPath,
    })
  })
}
function closeSelectedTag(view: any) {
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
  const offsetLeft = inst?.ctx?.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = inst?.ctx?.$el.offsetWidth // container width
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
