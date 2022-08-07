<template>
  <div>
    <el-dialog
      style="padding: 10px"
      v-model="dialogVisible"
      title="配置过滤项"
      width="40%"
      :modal="false"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="item in fieldOptions || []"
          :key="item.model || item.id || item.key"
          :label="item.model || item.id || item.key"
          >{{ item.label || item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="mini" @click="this.onCancel">取消</el-button>
          <el-button type="primary" size="mini" @click="this.onSave"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="js">
/**
 * 多过滤可配置组件的配置弹框
 * @author mayuxian
 */
export default {
  props: {
    fieldOptions: {
      default: null,
      type: Array,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    modelValue: {
      type: Array || Object,
      default: null,
    },
  },
  emits: ['update:modelValue', 'visibleChange','close'],
  data() {
    return {
      dialogVisible: false,
      checkList: [],
    }
  },
  watch: {
    dialogVisible(newVal) {
      this.init()
      this.$emit('visibleChange', newVal)
    },
    visible(newVal) {
      this.dialogVisible = newVal
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.checkList = (this.modelValue && this.modelValue.slice(0)) || []
    },
    onSave() {
      this.$emit('update:modelValue', this.checkList)
      this.$emit('close', this.checkList)
      this.dialogVisible = false
    },
    onCancel() {
      this.dialogVisible = false
    },
  },
}
</script>
