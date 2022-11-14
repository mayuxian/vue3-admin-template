<template>
  <component :is="type" v-bind="linkProps(to)" :key="to.path">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouterLink, useLink } from 'vue-router'
export default defineComponent({
  props: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...RouterLink.props,
  },
  setup(props) {
    function checkExternal(path: string) {
      return /^(https?:|mailto:|tel:)/.test(path)
    }
    const isExternal = checkExternal(props.to)
    const type = isExternal ? 'a' : 'router-link'
    function linkProps(to: any) {
      if (isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        }
      }
      return {
        to: { path: to },
        // to: to,
      }
    }
    return { type, linkProps }
  },
})
</script>
