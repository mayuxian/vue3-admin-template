<template>
  <div style="width: 100%">
    <el-upload v-bind="$attrs" :http-request="httpRequest">
      <slot></slot>
      <slot name="trigger"></slot>
      <slot name="tip"></slot>
      <slot name="file"> </slot>
    </el-upload>
    <el-progress v-if="props.progress && progressVisible" style="width: 100%; margin-top: 0px"
      :percentage="progressPercent" />
  </div>
</template>

<script lang="ts" setup>
import { UploadRequestOptions } from 'element-plus'
// import $cos from './tencent-cos'
//#region define
const progressPercent = ref()
const progressVisible = ref(false)
const emit = defineEmits(['on-success', 'on-error'])
const props = defineProps({
  progress: Boolean,
})
watch(
  () => props.progress,
  (newVal: boolean) => {
    console.log('progress val--- ', newVal)
  },
  {
    immediate: true,
  }
)
//#endregion
//#region reactive data
//#endregion
//#region methods
//#endregion
//#region events
function httpRequest(options: UploadRequestOptions) {
  return upload(options.file, 'collect_admin_user')
}
function upload(file: File, pathKey: string) {
  return new Promise((resolve, reject) => {
    progressPercent.value = 0
    progressVisible.value = true
    const params = {
      domain:
        import.meta.env.VITE_APP_BASE_API +
        '/applet-admin/collect-applet-management/management/upload/getTempSign',
      env: import.meta.env.VITE_APP_ENV,
      name: file.name,
      body: file,
      busId: pathKey,
      bucket: import.meta.env.VITE_APP_CLOUD_BUCKET,
      region: import.meta.env.VITE_APP_CLOUD_REGION,
      onProgress: (progress: { percent: number }) => {
        console.log('onProgress', progress)
        progressPercent.value = progress.percent * 100
      },
    }
    //TODO:
    // $cos.putObject(
    //   params,
    //   (res: { code: number; data: object | undefined | null }) => {
    //     progressVisible.value = false
    //     if (res.code == 0) {
    //       emit('on-success', res.data)
    //       resolve(res)
    //       //失败
    //     } else {
    //       emit('on-error', res.data)
    //       reject(res)
    //     }
    //   }
    // )
  })
}
//#endregion
</script>

<style scoped lang="scss"></style>
