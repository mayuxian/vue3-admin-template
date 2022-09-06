<template>
  <div :key="props.slotKey" class="infoitem-box" v-bind="$attrs">
    <div
      class="infoitem-label"
      :style="`width:${props.labelWidth};${props.labelStyle}`"
      >{{ label }}
    </div>
    <slot v-if="$slots.default" :style="`min-width:${props.textWidth}`"></slot>
    <slot
      v-else-if="$slots[props.slotKey]"
      :name="props.slotKey"
      :style="`min-width:${props.textWidth}`"
    ></slot>
    <template v-else>
      <div
        :class="`infoitem-text ${props.textClass}`"
        :style="`min-width:${props.textWidth};${props.textStyle}`"
        >{{ text }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  slotKey: {
    type: String || Number,
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: String,
    default: '160px',
  },
  labelStyle: {
    type: String,
    default: '',
  },
  textWidth: {
    type: String,
    default: '500px',
  },
  textStyle: {
    type: String,
    default: '',
  },
  textClass: {
    type: String,
    default: '',
  },
})
const label = computed(() => props.label)
const text = computed(() => props.text)
</script>

<style scoped lang="scss">
.infoitem-box {
  // display: inline-block;
  margin-right: 24px;
  text-align: left;
  vertical-align: top;
  // display: flex;
  // justify-content: start;
}
.infoitem-label {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  letter-spacing: 1px;
  margin: 8px 0;
  text-align: left;
  vertical-align: middle;
}
.infoitem-text {
  min-height: 36px;
  line-height: 36px;
  background: #fafafa;
  border-radius: 4px;
  text-align: left;
  display: inline-block;
  vertical-align: middle;

  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin: 8px 0;
  padding-left: 10px;
  text-align: left;

  :deep(.el-image) {
    vertical-align: middle;
  }
  :deep(img) {
    vertical-align: middle;
  }
}
</style>
