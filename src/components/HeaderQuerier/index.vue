<template>
  <div>
    <multi-filter
      ref="multiFilter"
      v-model="$filterParams"
      :field-options="fieldOptions"
      :list-options="listOptions"
      :label-visible="true"
      :form-props="formProps"
      style="min-height: 42px"
    >
      <div>
        <div v-if="fieldOptions?.length" style="display: inline-block">
          <el-button type="primary" @click="onQuery">查询</el-button>
          <!-- <el-button @click="onReset">重置</el-button> -->
          <slot></slot>
        </div>
      </div>
    </multi-filter>
    <div style="position: fixed; right: 20px; margin-top: -42px">
      <slot name="query-right" />
    </div>
  </div>
</template>
<script>
import MultiFilter from '../MultiFilter/index'
export default {
  components: {
    MultiFilter,
  },
  props: {
    formProps: {
      type: Object,
      default: null,
    },
    fieldOptions: {
      type: Array,
      required: false,
      default() {
        return null
      },
    },
    listOptions: {
      default: null,
      type: Object,
    },
    // eslint-disable-next-line vue/require-prop-types
    modelValue: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue', 'query'],
  data() {
    return {
      $filterParams: {},
      multiFilterFields: null,
      filterlistOptions: null,
    }
  },
  watch: {
    $filterParams: {
      deep: true,
      handler(newVal, oldVal) {
        console.log('watch $filterParams ', newVal)
        if (newVal != oldVal) {
          this.$emit('update:modelValue', newVal)
        }
      },
    },
  },
  methods: {
    onQuery() {
      console.log('onQuery $filterParams ', this.$filterParams)
      let params = {
        ...(this.$filterParams || {}),
        // size: 10,
        // current: 1,
      }
      this.$emit('update:modelValue', params)
      this.$emit('query', params)
    },
    onReset() {
      this.$refs.multiFilter.reset()
    },
  },
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-top: 10px !important;
  vertical-align: middle !important;
  align-content: center;
}
.header-query-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
</style>
