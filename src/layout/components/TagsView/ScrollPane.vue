<template>
  <el-scrollbar
    ref="scrollContainer"
    class="scroll-container"
    @wheel.prevent="handleScroll"
    @scroll.capture="emitScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
const inst: any = getCurrentInstance()
const tagAndTagSpacing = 4 // tagAndTagSpacing
const scrollContainer: any = ref<HTMLDivElement>()
const scrollWrapper = computed(() => scrollContainer.value.wrapRef)
const emit = defineEmits(['scroll'])

function handleScroll(e: any) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper: any = scrollWrapper.value
  const left = $scrollWrapper.scrollLeft + eventDelta / 4
  $scrollWrapper.scrollLeft = left
}
function emitScroll() {
  emit('scroll')
}
function moveToTarget(currentTag: any) {
  const $container = unref(scrollContainer).$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper: any = scrollWrapper
  const tagList = inst.parent?.exposed?.tagRefs
  let firstTag = null
  let lastTag = null
  // find first tag and last tag
  if (tagList?.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex((item: any) => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}
defineExpose({
  moveToTarget,
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
