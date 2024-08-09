<template>
  <div class="upload-box">
    <el-upload
      :file-list="fileList"
      :accept="accept"
      :action="action"
      :before-upload="beforeUpload"
      :class="['upload', drag ? 'no-border' : '', limit === fileList?.length ? 'hide-upload' : '']"
      :drag="drag"
      :headers="uploadHeaders"
      :limit="limit"
      :data="{ path }"
      :multiple="multiple"
      :on-error="uploadError"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      ref="refName"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer
      v-if="imgViewVisible"
      :url-list="[viewImageUrl]"
      @close="imgViewVisible = false"
    />
  </div>
</template>

<script setup lang="ts" name="UploadImage">
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

type Props = {
  modelValue: string | any[]
  action: string
  drag: boolean
  multiple?: boolean
  disabled: boolean
  limit?: number
  fileSize?: number
  accept?: string
  height?: string // 组件的高度
  width?: string // 组件的宽度
  borderRadius?: string // 组件的圆角
  limitWidth?: number // 限制图片宽度,明确的尺寸 ==> 非必传（默认为 0,可以传60，代表宽度限制为60px）
  limitHeight?: number // 限制图片高度,明确的尺寸 ==> 非必传（默认为 0,可以传60，代表宽度限制为60px）
  maxWidth?: number // 最大图片宽度,明确的尺寸 ==> 非必传（默认为 0）
  maxHeight?: number // 最大图片高度,明确的尺寸 ==> 非必传（默认为 0）
  wh?: string[] // 限制图片比例：比如2:1 ==> 非必传（默认为[],可以传['2:1']，代表宽度比必须为2:1）
  floatBy?: number // 允许图片上下浮动量；只有wh有内容时，floatBy才生效；比如0.2，代表允许上下浮动20%
  path?: string // 上传路径：后端提供
}
const props = withDefaults(defineProps<Props>(), {
  action: import.meta.env.VITE_UPLOAD_URL,
  drag: true,
  disabled: false,
  fileSize: 5,
  width: '150px',
  height: '150px',
  borderRadius: '8px',
  multiple: false,
  path: 'material/image',
  wh: () => []
})
const emit = defineEmits(['update:modelValue', 'change'])

const uploadHeaders = ref({
  Authorization: 'Bearer ' + userStore.getToken,
})
const buildFileList = () => {
  if (props.multiple) {
    return props.modelValue || []
  }
  return props.modelValue ? [props.modelValue] : []
}
const fileList = ref<UploadUserFile[]>(buildFileList())

const refName = ref()
const viewImageUrl = ref('')
const imgViewVisible = ref(false)

watch(
  () => props.modelValue,
  () => {
    fileList.value = buildFileList()
  }
)
watch(
  () => fileList.value,
  (val) => {
    emit('change', val)
  }
)

const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  // console.log('--rawFile', rawFile)
  const fileSuffix = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1)
  if (props.accept.indexOf(fileSuffix) < 0) {
    ElMessage.warning(`请上传${props.accept}类型的文件`)
    return false
  }

  // 名字重复
  if (fileList.value.map((e) => e.name).includes(rawFile.name)) {
    ElMessage.warning('请勿重复上传!')
    return false
  }

  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  // 文件大小
  if (!imgSize) {
    ElMessage.warning(`上传图片大小不能超过 ${props.fileSize}M！`)
    return false
  }

  // 尺寸大小
  const res = await judgeImgWH(rawFile)
  if (!res) return false

  // 图片比例
  if (props.wh?.length) {
    const res = await ImageAspectRatio(rawFile)
    if (!res) return false
  }
  return true
}

const judgeImgWH = (rawFile) => {
  const image = new Image()
  image.src = window.URL.createObjectURL(rawFile)
  return new Promise((resolve, reject) => {
    image.onload = () => {
      rawFile.width = image.width
      rawFile.height = image.height
      if (props.limitWidth && props.limitHeight) {
        if (image.width === props.limitWidth && image.height === props.limitHeight) {
          return resolve(true)
        } else {
          ElMessage.warning(`图片的尺寸必须为${props.limitWidth}*${props.limitHeight}px！`)
          return reject(false)
        }
      }
      if (props.maxWidth || props.maxHeight) {
        if (props.maxWidth > 0 && image.width > props.maxWidth) {
          ElMessage.warning(`图片最大宽度必须小于或等于${props.maxWidth}px！`)
          return reject(false)
        } else if (props.maxHeight > 0 && image.height > props.maxHeight) {
          ElMessage.warning(`图片最大高度必须小于或等于${props.maxHeight}px！`)
          return reject(false)
        }
      }
      return resolve(true)
    }
  })
}
const ImageAspectRatio = (rawFile) => {
  const image = new Image()
  image.src = window.URL.createObjectURL(rawFile)
  const ratios = props.wh.map((item) => {
    const [w, h] = item.split(':')
    return w / h
  })
  return new Promise((resolve, reject) => {
    image.onload = () => {
      rawFile.width = image.width
      rawFile.height = image.height
      const percent = image.width / image.height

      if (!props.floatBy) {
        if (ratios.includes(percent)) {
          return resolve(true)
        } else {
          ElMessage.warning(`图片的比例必须为${props.wh.toString()}！`)
          return reject(false)
        }
      } else {
        const floatRatios = props.wh.map((item) => {
          const [w, h] = item.split(':')
          return [(w / h) * (1 - props.floatBy), (w / h) * (1 + props.floatBy)]
        })
        const matchRatios = floatRatios.some((item) => {
          const [min, max] = item
          return percent >= min && percent <= max
        })
        if (matchRatios) {
          return resolve(true)
        } else {
          ElMessage.warning(`图片的比例必须为${props.wh.toString()}！`)
          return reject(false)
        }
      }
    }
  })
}
// 图片上传错误提示
const uploadError = () => {
  ElMessage.error('图片上传失败，请您重新上传！')
}

// 文件数超出提示
const handleExceed = () => {
  ElMessage.error(`当前最多只能上传 ${props.limit} 张图片，请移除后上传！`)
  // ElNotification({
  //   title: '温馨提示',
  //   message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
  //   type: 'warning'
  // })
}

// 图片上传成功提示
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  // 等到所有都成功了
  if (uploadFiles.some((item) => !item.url)) return
  if (response && response.code != 0) {
    message.error('上传失败')
    refName.value.handleRemove(uploadFile)
  }
  fileList.value = uploadFiles
    .filter((item) => item.url)
    .map((item) => {
      return {
        ...item,
        width: item.raw?.width || item?.width,
        height: item.raw?.height || item?.height,
        path: item.response ? item.response.data.path : item.url,
        url: item.response ? item.response.data.url : item.url
      }
    })
  emit('update:modelValue', props.multiple ? fileList.value : fileList.value?.[0])
  ElMessage.success('上传成功')
}
// 删除图片
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
    .filter((item) => item.url)
    .map((item) => {
      return {
        ...item,
        width: item.raw?.width || item.width,
        height: item.raw?.height || item.height,
        path: item.response ? item.response.data.path : item.url,
        url: item.response ? item.response.data.path : item.url
      }
    })
  console.log('=======', fileList.value)
  emit('update:modelValue', props.multiple ? fileList.value : fileList.value?.[0])
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  viewImageUrl.value = uploadFile.url!
  imgViewVisible.value = true
}
</script>
<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  .hide-upload.upload {
    :deep(.el-upload) {
      display: none;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
