<template>
    <el-checkbox-group v-bind="$attrs">
        <template v-for="tag in (props.list || [])">
            <slot v-if="$slots['item']" :data="tag" name="item"> </slot>
            <el-checkbox v-else border :value="props.valueKey ? tag[props.valueKey] : tag?.value || tag?.id || tag"
                style="vertical-align: middle;min-width: 120px;" @change="onCheckboxChange($event, tag)">
                <slot class="tag-label" v-if="$slots.default" :data="tag"> </slot>
                <div v-else class="tag-label">{{ props.labelKey ? tag[props.labelKey] : tag?.label || tags?.name || tag
                    }}</div>
            </el-checkbox>
        </template>
        <slot v-if="$slots['append']" :data="tag" name="append"> </slot>
    </el-checkbox-group>
</template>

<script setup lang="js">
const props = defineProps({
    list: {
        type: Array,
        default: null
    },
    labelKey: {
        type: String,
        default: null
    },
    valueKey: {
        type: String,
        default: null
    }
})
function onCheckboxChange(e, tag) {
    if (tag) {
        tag.selected = e ? 1 : 0;
    }
}

</script>

<style lang="scss" scoped>
.tag-label {
    width: 100%;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
}

:deep(.el-checkbox__label) {
    width: 100%;
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