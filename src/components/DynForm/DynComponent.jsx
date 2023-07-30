import {
  defineComponent,
  h,
  resolveComponent,
  getCurrentInstance,
  resolveDynamicComponent,
} from 'vue'
/* eslint-enable */
export default defineComponent({
  props: {
    modelValue: {
      type: String, //[String, Number, Object],
      default: '',
    },
    cmptName: {
      default: '',
      type: String,
    },
    cmptProps: {
      default: null,
      type: Object,
    },
    list: {
      default: null,
      type: Array,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      innerValue: '',
    }
  },
  computed: {
    builtInProps() {
      return Object.assign(Object.create(null), {
        // size: 'small',
      })
    },
  },
  watch: {
    modelValue(val) {
      this.innerValue = val || (val === 0 ? 0 : '')
    },
    innerValue(val, oldVal) {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }
      this.$emit('update:modelValue', val || (val === 0 ? 0 : ''))
    },
    list(val) {
      this.innerValue = null
    },
  },
  created() {
    this.innerValue = this.modelValue || null
    this.inst = getCurrentInstance()
  },
  methods: {
    getSubCmpt(parentCmptName) {
      if (parentCmptName === 'el-select') {
        return this.getSelectOption()
      } else {
        return null
      }
    },
    getSelectOption() {
      if (!this.list) {
        return null
      }
      return this.list?.map((item, index) => {
        return (
          <el-option
            key={item.id || item.name || index}
            value={item.id || (item.id === 0 ? 0 : item.key)}
            label={item.name || item.label}></el-option>
        )
      })
    },
  },
  render() {
    let cmpt = this.cmptName
    let props = Object.assign(this.builtInProps, this.cmptProps)
    props.key = props.key || Date.now()
    // const comp = cmpt && resolveDynamicComponent(cmpt)
    const comp = cmpt && resolveComponent(cmpt)
    if (comp) {
      // console.log(this.inst)
      // const elComp = resolve => require(['element-plus/es']['ElInput'], resolve)
      // // const elComp = () => import(`element-plus/es`)['ElInput']
      // this.$.appContext.app?.use(comp, elComp)
      return h(
        comp,
        {
          ...props,
          modelValue: this.innerValue,
          'onUpdate:modelValue': value => {
            this.innerValue = value instanceof String ? value?.trim() : value
          },
        },
        this.getSubCmpt(cmpt)
      )
    } else {
      return <span>组件类型名称componentName为空</span>
    }
  },
})
