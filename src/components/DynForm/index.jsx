import DynComponent from './DynComponent'
import { defineComponent, resolveComponent } from 'vue'
export default defineComponent({
  components: {
    DynComponent,
  },
  props: {
    fieldOptions: {
      type: Array,
      required: false,
      default() {
        return null
      },
    },
    formProps: {
      default() {
        return null
      },
      type: Object,
    },
    listOptions: {
      default: null,
      type: Object,
    },
    labelVisible: {
      default: true,
      type: Boolean,
    },
    watchDelay: {
      default: 500,
      type: Number,
    },
    deltaEnabled: {
      default: true,
      type: Boolean,
    },
  },
  emits: ['change'],
  data() {
    return {
      originData: {},
      formData: {},
      optimizedData: {},
      status: null,
    }
  },
  computed: {
    builtInFormProps() {
      return Object.assign(Object.create(null), {
        inline: true,
        // showMessage: false
      })
    },
    builtInFormItemProps() {
      return Object.create(null)
    },
    statusEnums() {
      return {
        initializing: 1,
        initialized: 2,
      }
    },
  },
  watch: {
    formData: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.status === this.statusEnums.initializing) return
        this.debouceChange(newVal, this.watchDelay)()
      },
    },
    optimizedData: {
      deep: true,
      handler(newVal, oldVal) {
        Object.assign(this.formData, newVal)
      },
    },
  },
  created() {
    this.initProperies()
  },
  methods: {
    init(data) {
      if (!data) return
      this.originData = JSON.parse(JSON.stringify(data))
      this.status = this.statusEnums.initializing
      for (const key in this.formData) {
        if (data.hasOwnProperty(key)) {
          this.formData[key] = data[key]
        }
      }
      this.status = this.statusEnums.initialized
    },
    initProperies() {
      this.formData = (this.fieldOptions || []).reduce((preVal, item) => {
        if (!preVal[item.model]) {
          preVal[item.model] =
            item.defaultValue !== undefined ? item.defaultValue : ''
        }
        return preVal
      }, {})
    },
    reset() {
      return this.$refs.elForm.resetFields()
    },
    validate() {
      return this.$refs.elForm.validate()
    },
    clearValidate(props = null) {
      return this.$refs.elForm.clearValidate(props)
    },
    debouceChange(newVal, delay) {
      return () => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.deltaEnabled) {
            //启用差量更新优化
            this.optimizedData = this.getOptimizedData(newVal)
            if (this.optimizedData) {
              this.$emit('change', this.optimizedData)
            }
          } else {
            this.$emit('change', newVal)
          }
        }, delay)
      }
    },
    //获取优化的数据
    getOptimizedData(data) {
      if (!data) return null
      let optimizedData = {}
      for (const key in data) {
        if (!data.hasOwnProperty(key)) continue
        //如果默认值有存在之,则比较是否改变
        if (this.originData && this.originData[key]) {
          //不相等表示值已改变,则需要更新
          if (this.originData[key] != data[key]) {
            optimizedData[key] = data[key]
          } else {
            //值未改变,则无需更新
          }
        }

        //默认值中不存在,则存在值则需要更新
        else if (data[key] || data[key] === 0) {
          optimizedData[key] = data[key]
        }
      }
      return optimizedData
    },
    getData() {
      return this.formData
    },
  },
  render() {
    let props = Object.assign(this.builtInFormProps, this.formProps)
    props.model = this.formData
    const slotDefault = this.$slots.default
    const DynComponent = resolveComponent('DynComponent')
    return (
      <el-form ref="elForm" {...props}>
        {this.fieldOptions &&
          this.fieldOptions.map((item, index) => {
            item.model = item.model || item.prop
            let list =
              (item.componentProps && item.componentProps.list) ||
              (this.listOptions && this.listOptions[item.model]) ||
              (this.listOptions && this.listOptions[item.model + 'List'])
            let label = this.labelVisible
              ? item.label || (item.formProps && item.formProps.label)
              : null
            const slotPreFix = this.$slots[item.model + '-prefix']
            const slotModel = this.$slots[item.model]
            const slotSuffix = this.$slots[item.model + '-suffix']
            const slotLabel = this.$slots[item.model + '-label']
            return (
              <el-form-item
                {...item.formProps}
                label={label}
                prop={item.model}
                key={item.model}
                scopedSlots={{
                  label: props => {
                    return slotLabel && slotLabel()
                  },
                }}>
                {slotPreFix && slotPreFix()}
                {(slotModel && slotModel()) || (
                  <DynComponent
                    cmptProps={item.componentProps}
                    cmptName={item.componentName}
                    list={list}
                    vModel={this.formData[item.model]}
                    key={item.model || Date.now()}></DynComponent>
                )}
                {slotSuffix && slotSuffix()}
              </el-form-item>
            )
          })}
        {slotDefault && slotDefault()}
      </el-form>
    )
  },
})
