<template>
  <div
    :key="props.slotKey"
    class="infoitem-box"
    :style="Object.assign({ width: `${props.width}` }, $attrs)"
  >
    <div class="infoitem-label" :style="labelStyle">{{ label }} </div>
    <slot v-if="$slots.default"></slot>
    <slot v-else-if="$slots[props.slotKey]" :name="props.slotKey"></slot>
    <template v-else>
      <div :class="`infoitem-text ${props.textClass || ''}`" :style="textStyle"
        >{{ text }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
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
  width: {
    type: String,
    default: '300px',
  },
  labelStyle: {
    type: String,
    default: '',
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

<style lang="scss">
.infoitem-box {
  display: inline-block;
  margin-right: 24px;
  text-align: left;
  vertical-align: middle;
}
.infoitem-label {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 8px 0;
  text-align: left;
}
.infoitem-text {
  width: 100%;
  height: 36px;
  line-height: 36px;
  background: #fafafa;
  border-radius: 4px;

  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin: 8px 0;
  padding-left: 10px;
  text-align: left;
}
</style>
