<template>
    <el-dialog style="padding: 20px" :model-value="props.modelValue" title="资源标签" width="730" append-to-body
        destroy-on-close @close="onClose">
        <el-card v-for="tag in tagGroup" shadow="always" :key="tag.tag_id" style="margin-bottom: 10px;">
            <div v-if="!tag.son?.length">
                <div style="font-size: 16px;font-weight: bold;margin: 0px 0 10px 0;">{{ tag.type_name }}</div>
                <tag-group :modelValue="tag.tag_list?.filter(x => !!x.selected).map(x => x.tag_id)"
                    :list="tag.tag_list?.filter(x => x.user_id != userInfo?.user_id)" :key="tag.type_id"
                    :name="tag.type_id" label-key="tag_name" value-key="tag_id" size="small" style="line-height: 32px;"
                    class="tag-group" @change="onTagChange($event, tag.type_id)">
                    <template #append="{ data }">
                        <TagInput v-for="item in tag.tag_list?.filter(x => x.user_id == userInfo?.user_id)"
                            :model-value="item" :key="item.tag_id" :type_id="tag.type_id" :resource_id="props.contactId"
                            @delete="onLoadTags" @add="onLoadTags"
                            @update:modelValue="($event) => item.selected = $event.selected" />
                        <TagInput :key="Date.now()" style="margin: 5px 0 0 0px;" :type_id="tag.type_id"
                            :resource_id="props.contactId" @delete="onLoadTags" @add="onLoadTags" />
                    </template>
                </tag-group>
            </div>
            <div v-else>
                <div style="font-size: 16px;font-weight: bold;margin:0 0 10px 0;">{{ tag.type_name }}</div>
                <div v-for="sonTag in tag.son" :key="sonTag.type_id" style="margin: 5px 0 10px 0;">
                    <div style="font-size: 13px;font-weight: bold;margin: 5px 0;">{{ sonTag.type_name }}</div>
                    <tag-group :modelValue="sonTag.tag_list?.filter(x => !!x.selected).map(x => x.tag_id)"
                        :list="sonTag.tag_list?.filter(x => x.user_id != userInfo?.user_id)" :key="sonTag.type_id"
                        :name="sonTag.type_name" label-key="tag_name" value-key="tag_id" size="small" class="tag-group"
                        style="line-height: 32px;" @change="onTagChange($event, sonTag.type_id)">
                        <template #append="{ data }">
                            <TagInput v-for="item in sonTag.tag_list?.filter(x => x.user_id == userInfo?.user_id)"
                                :modelValue="item" :key="item.tag_id" :type_id="sonTag.type_id"
                                :resource_id="props.contactId" @delete="onLoadTags" @add="onLoadTags"
                                @update:modelValue="($event) => item.selected = $event.selected" />
                            <TagInput :key="Date.now()" style="margin: 5px 0 0 0px;" :type_id="sonTag.type_id"
                                :resource_id="props.contactId" @delete="onLoadTags" @add="onLoadTags" />
                        </template>
                    </tag-group>
                </div>
            </div>
        </el-card>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="onSubmit"> 保存 </el-button>
                <el-button @click="onClose">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="js">
import FileUpload from '@/components/Upload/FileUpload.vue';
import contactApi from '@/api/contact'
import tagApi from '@/api/tag'
import TagGroup from '@/components/TagGroup/index.vue'
import { useUserStore } from '@/store/modules/user'
import TagInput from '@/common/TagInput/index.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    contactId: {
        type: [Number, String],
        default: null
    },
    ids: {
        type: Array,
        default: null
    }
})
const emits = defineEmits(['udpate:modelValue', 'success'])
const formRef = ref()

const userStore = useUserStore()
const userInfo = computed(() => {
    return userStore.getUserInfo;
})

const tagGroup = ref([])
const formData = reactive({
    ids: [],
    remark: null,
})
const selectItems = ref([])
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        init()
    }
}, { immediate: true })


async function init() {
    const res = await tagApi.getTagList(props.contactId);
    tagGroup.value = res.result || []
    if (props.ids?.length) {
        tagGroup.value?.forEach(x => {
            if (x.son?.length) {
                x.son?.forEach(item => {
                    item.tag_list?.forEach(y => {
                        if (props.ids?.some(id => id == y.tag_id)) {
                            y.selected = 1
                        } else {
                            y.selected = 0
                        }
                    })
                })

            } else {
                x.tag_list?.forEach(y => {
                    if (props.ids?.some(id => id == y.tag_id)) {
                        y.selected = 1
                    } else {
                        y.selected = 0
                    }
                })
            }
        })
    }
}

function loadSelectTags() {
    selectItems.value = []
    tagGroup.value?.forEach(x => {
        if (x.son?.length) {
            x.son?.forEach(item => {
                item.tag_list?.forEach(y => {
                    if (y.selected == 1) {
                        selectItems.value.push(y)
                    }
                })
            })

        } else {
            x.tag_list?.forEach(y => {
                if (y.selected == 1) {
                    selectItems.value.push(y)
                }
            })
        }
    })
}

function onTagChange(tagIds, typeId) {
    // loadSelectTags()
}
function onLoadTags() {
    init();
    loadSelectTags()
}
async function onSubmit() {
    loadSelectTags()
    onClose()
    emits('success', selectItems.value)
}

function onClose() {
    emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.tag-group {
    display: inline-block;

    :deep(.el-checkbox:last-of-type) {
        margin-right: 30px !important;
    }
}
</style>