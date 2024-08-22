<template>
  <el-dialog
    v-model="dialogVisible"
    :width="width"
    style="padding:10px 0"
    :destroy-on-close="true"
    @closed="onDialogClosed"
  >
    <FileUpload />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import FileUpload from './index.vue'
export default {
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '45%',
    },
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  created() {
    this.dialogVisible = this.visible
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      if (newVal === oldVal) return
      this.$emit('update:visible', newVal)
    },
  },
  methods: {
    onDialogClosed() {},
  },
}
</script>

<style lang='stylus' scoped></style>
