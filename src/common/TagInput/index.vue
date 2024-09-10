<template>
    <div style="display: inline-block;" v-bind="$attrs">
        <el-checkbox v-if="!isEdit" border :value="formData.tag_id" style="vertical-align: middle;min-width: 120px;"
            @change="onCheckboxChange($event)">
            <div style="width: 100%;">
                <div style="display: inline-block;vertical-align: middle;">
                    <div v-if="formData.tag_name" style="display: inline-block;">{{ formData.tag_name }}</div>
                    <div v-else style="display: inline-block;">
                        <el-icon style="margin-right: 2px; vertical-align: middle;">
                            <Plus />
                        </el-icon>
                        <div style="vertical-align: middle;display: inline-block;"> {{ '自定义标签' }}</div>
                    </div>
                </div>
                <div class="tag-edit" style="display: inline-block;">
                    <el-icon @click.prevent="onEdit">
                        <EditPen />
                    </el-icon>
                    <el-icon v-if="!isNew" style="margin-left: 5px;" @click.prevent="onDelete">
                        <Close />
                    </el-icon>
                </div>
            </div>
        </el-checkbox>
        <el-input v-if="isEdit" v-model="formData.tag_name" size="small"
            :style="`${isNew ? 'margin-left:0px;' : 'margin-right:10px;'}width: 140px;`" class="tag-input">
            <template #append>
                <el-icon color="#0F40F5" @click.prevent="onConfirm">
                    <Check />
                </el-icon>
                <el-icon style="margin-left: 5px;" @click.prevent="onDelete">
                    <Close />
                </el-icon>
            </template>
        </el-input>
        <div v-if="errMsg" style="color: red;font-size: 12px;line-height: 12px;">{{ errMsg }}</div>
    </div>
</template>

<script lang="js" setup>
import tagApi from '@/api/tag'
const emits = defineEmits(['update:modelValue', 'delete', 'edit', 'add'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: null
    },
    type_id: {
        type: [String, Number],
        default: null
    },
    resource_id: {
        type: String,
        default: null
    },
})
const formData = reactive({
    tag_id: null,
    tag_name: null
})
const isNew = ref(true)
const isEdit = ref(false)

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        formData.tag_name = newVal?.tag_name;
        formData.tag_id = newVal?.tag_id;
        isNew.value = false;
    }
}, {
    deep: true,
    immediate: true
})

const errMsg = ref()
async function onConfirm() {
    errMsg.value = null
    if (!formData.tag_name) {
        errMsg.value = '请输入标签名称'
        return;
    }
    const res = await tagApi.upsertTag({
        tag_id: formData.tag_id || props.modelValue?.tag_id,
        tag_name: formData.tag_name || props.modelValue?.tag_name,
        type_id: props.type_id,
        resource_id: props.resource_id
    })
    formData.tag_id = res.resoult?.tag_id;
    if (isNew.value) {
        emits('add')
    } else {
        emits('edit')
    }
    emits('update:modelValue', res.result || {})
    ElMessage.success((isNew.value ? '添加' : '更新') + '标签成功')
    isNew.value = false;
    isEdit.value = false;
}
async function onDelete() {
    if (isNew.value || isEdit.value) {
        isEdit.value = false;
        formData.tag_name = props.modelValue?.tag_name
        errMsg.value = null
        return;
    }
    await ElMessageBox.confirm(`删除后所有使用该标签的人脉都会删除该标签，确认删除吗？`, '删除', {
        confirmButtonText: '删除',
        confirmButtonClass: 'tag-delete-confirm',
        cancelButtonText: '取消',
        buttonSize: 'small'
    })
    await tagApi.deleteTag({
        tag_id: formData.tag_id || props.modelValue?.tag_id
    });
    emits('delete')
    isEdit.value = false
    ElMessage.success('标签删除成功')
}
async function onEdit() {
    if (!isNew.value) {
        await ElMessageBox.confirm(`修改后所有使用该标签的人脉也会更新为新标签，确认修改吗？`, '修改', {
            confirmButtonText: '修改',
            cancelButtonText: '取消',
            buttonSize: 'small'
        })
    }
    isEdit.value = true;
}
function onCheckboxChange(e) {
    if (props.modelValue) {
        const { ...data } = props.modelValue;
        data.selected = e ? 1 : 0;
        emits('update:modelValue', data || {})
    }
}

</script>

<style lang="scss" scoped>
.tag-input {
    :deep(.el-input-group__append) {
        padding: 0 5px !important;
        background: transparent !important;
    }
}

.tag-edit {
    float: right;
    vertical-align: middle;
}

.tag-delete-confirm {
    background: red !important;
    border: 1px solid red !important;
}

:deep(.el-checkbox__label) {
    width: 100% !important;
    text-align: left;
}

:deep(.el-checkbox) {
    position: relative !important;
    text-align: center !important;
    background-color: #fff;
    border-radius: 2px;

    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;

    &.is-checked {
        color: #1890ff !important;
        border: 1px solid #1890ff !important;

        &::before {
            content: '' !important;
            position: absolute !important;
            right: 0;
            top: 0;
            border: 7px solid #1890ff;
            border-bottom-color: transparent;
            border-left-color: transparent;
        }

        &::after {
            content: '' !important;
            width: 1px;
            height: 3px;
            position: absolute !important;
            right: 1px;
            top: 0;
            border: 2px solid #fff;
            border-top-color: transparent;
            border-left-color: transparent;
            transform: rotate(45deg);
        }
    }
}

:deep(.el-checkbox__input) {
    display: none !important;
}
</style>