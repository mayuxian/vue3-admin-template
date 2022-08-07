<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const SvgIcon = resolveComponent('SvgIcon')
    const { icon, title } = context.props || this.$props || {}
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon name={icon} icon-class={icon} />)
    }

    if (title) {
      vnodes.push(<span>{title}</span>)
    }
    return vnodes
  },
}
</script>
