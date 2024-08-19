<template>
  <section>
    <el-upload ref="upload" :action="actionUrl" :list-type="listType" :auto-upload="true" :data="uploadParams"
      :before-upload="onBeforeUpload" :on-change="onFileChange" :on-success="onUploadSuccess" :on-exceed="onFileExceed"
      :on-error="onError" :accept="accept" :file-list="fileList" :with-credentials="true" :multiple="multiple"
      :limit="limitCount">
      <template #default>
        <i ref="uploadPlus" v-if="!disabledAdd && listType === 'picture-card'" class="el-icon-plus"></i>
        <el-button v-if="!disabledAdd && listType != 'picture-card'" size="small" type="primary">点击上传</el-button>
      </template>
      <template v-if="listType === 'picture-card'" #file="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="onFileReomve(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </template>
      <template #tip class="el-upload__tip">
        <div style="margin-top:10px; color: #a2a1a1; font-size: 12px">
          只能上传{{ accept }}文件，单个文件不超过{{ limitSizeText }}
          <div v-if="multiple" style="margin-top:5px">单次上传不可超过剩余可上传数量</div>
        </div>
      </template>
    </el-upload>
    <div v-if="errorMessage" style="margin-top: 5px">
      错误信息:
      <el-input :autosize="{ minRows: 2, maxRows: 6 }" style="max-height: 500px; user-select: text"
        :value="errorMessage" type="textarea" readonly></el-input>
    </div>
  </section>
</template>

<script>
// eslint-disable-next-line
import { defineComponent, ref, reactive } from 'vue'
export default defineComponent({
  props: {
    actionUrl: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '.png, .jpg, .jpeg',
    },
    listType: {
      type: String,
      default: 'picture-card',
    },
    limitSize: {
      type: Number,
      default: 5 * 1024 * 1024,
    },
    limitCount: {
      type: [Number, null],
      default: null,
    },
    uploadParams: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      actionUrl: this.actionUrl,
      disabledAdd: false,
      fileList: [],
      showDialog: false,
      errorMessage: null,
      // uploadParams: {},
    }
  },
  mounted() {
    this.addParentEle = this.$refs.uploadPlus?.parentElement
  },
  computed: {
    limitSizeText() {
      const kb = this.limitSize / 1024
      if (kb < 1024) {
        return kb + 'kb'
      }
      return kb / 1024 + 'M'
    },
  },
  methods: {
    onFileExceed(files, fileList) { },
    onFileChange(file, fileList) {
      // this.fileList = fileList
      //若设置了限制数量,并且文件数量<限制个数时
      if (this.limitCount) {
        this.disabledAdd = this.fileList?.length >= this.limitCount
      }
    },
    onFileReomve(file, fileList) {
      const index = this.fileList.indexOf(file)
      this.fileList?.splice(index, 1)
      //若设置了限制数量,并且文件数量<限制个数时
      if (this.limitCount) {
        this.disabledAdd = this.fileList?.length >= this.limitCount
      }
    },
    onError(err, file, fileList) {
      this.$refs.upload.clearFiles()
      this.errorMessage = typeof err === 'string' ? err : err?.message
    },
    onBeforeUpload(file) {
      const isLimitPass = file.size / 1024 / 1024 < this.limitSize
      if (!isLimitPass) {
        this.errorMessage = `上传头像图片大小不能超过 ${this.limitSizeText}!`
      }
      return isLimitPass
    },
    onUploadSuccess(res, files) {
      const errMsgs = []
      let fileList = []
      let successFileResult = []
      const uploadFileList = files instanceof Array ? files : [files]
      uploadFileList?.forEach(data => {
        const res = data.response
        if (res.returncode >= 0 && res.result) {
          //争取返回,并且有结果
          fileList.push(data)
          successFileResult.push(res.result)
        } else {
          errMsgs.push(res.message)
        }
      }, [])
      successFileResult = successFileResult?.flat()
      if (errMsgs.length > 0) {
        this.errorMessage = errMsgs.join('\r\n')
      }
      // this.$refs.upload.clearFiles()
      this.fileList = this.fileList.concat(fileList)
      if (!successFileResult?.length) return
      this.$emit('submit', successFileResult)
    },
  },
  watch: {
    disabledAdd(newVal, oldVal) {
      if (newVal === oldVal) return
      if (!this.addParentEle) return
      this.addParentEle.style.display = newVal ? 'none' : 'inline-block'
    },
  },
})
</script>

<style lang='stylus' scoped></style>
