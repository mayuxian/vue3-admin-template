import { defineComponent, resolveComponent } from 'vue'
import OptionsDialog from './OptionsDialog.vue'
import DynForm from '../DynForm/index'
export default defineComponent({
  components: {
    DynForm,
    OptionsDialog,
  },
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
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
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      filterData: null,
      dialogVisible: false,
      activateFieldList: null,
      activateFields: null,
    }
  },
  computed: {
    builtInFormProps() {
      return Object.assign(Object.create(null), {
        inline: true,
        showMessage: false,
        inlineMessage: true,
        // style: "el-form-item1"
      })
    },
    builtInFormItemProps() {
      return Object.assign(Object.create(null), {
        label: null,
      })
    },
  },
  watch: {
    filterData: {
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('update:modelValue', newVal)
      },
    },
  },
  beforeCreate() {
    this.filterData = null
    this.activateFieldList = null
  },
  created() {
    this.builtFormItemStyle = ';margin-bottom:10px'
    this.init()
  },
  methods: {
    init() {
      this.activateFieldList = this.getActivateFieldList()
      this.activateFields =
        this.activateFieldList && this.activateFieldList.map(x => x.model)
    },
    reset() {
      this.$refs.dynForm.reset()
    },
    onDialogClose(fields) {
      if (!fields) return
      this.setStoreOptions(fields)
      this.fieldOptions &&
        this.fieldOptions.forEach(item => {
          item.visible = fields.some(x => item.model === x)
        })
      this.init()
    },
    onShowDialog() {
      this.dialogVisible = true
    },
    getActivateFieldList() {
      this.initStoreOptions()
      if (!this.fieldOptions) return null
      this.fieldOptions.forEach(x => {
        if (!x.formProps) {
          x.formProps = {}
        }
        x.formProps.style = x.formProps.style
          ? x.formProps.style + this.builtFormItemStyle
          : this.builtFormItemStyle
      })
      return this.fieldOptions
        .filter(x => x.hidden !== true)
        .sort((preValue, curValue) => preValue.index - curValue.index)
    },
    initStoreOptions() {
      window.localStorage.removeItem(this.$route.path)
      let optionsStr = window.localStorage.getItem(this.$route.path)
      if (!optionsStr) {
        return
      }
      let options = JSON.parse(optionsStr)
      this.fieldOptions &&
        this.fieldOptions.forEach(x => {
          x.visible = options.some(key => key === x.model)
        })
    },
    setStoreOptions(fields) {
      //TODO:有待存储到数据库
      window.localStorage.setItem(this.$route.path, JSON.stringify(fields))
    },
  },
  render() {
    let props = Object.assign(this.builtInFormProps, this.formProps)
    const slotDefault = this.$slots.default
    const DynForm = resolveComponent('DynForm')
    return (
      <div>
        <DynForm
          ref="dynForm"
          formProps={props}
          fieldOptions={this.activateFieldList}
          listOptions={this.listOptions}
          labelVisible={this.labelVisible}
          watchDelay={0}
          onChange={data => {
            this.filterData = data
          }}>
          <el-form-item style={'display:none;' + this.builtFormItemStyle}>
            <el-button
              style="border:0px;paddding:0px"
              size="small"
              icon="el-icon-setting"
              onClick={() => this.onShowDialog()}></el-button>
          </el-form-item>
          {slotDefault ? (
            <el-form-item style={this.builtFormItemStyle}>
              {slotDefault()}
            </el-form-item>
          ) : null}
        </DynForm>
        <options-dialog
          style="display:none;"
          vModel={this.activateFields}
          fieldOptions={this.fieldOptions}
          visible={this.dialogVisible}
          onVisibleChange={visible => {
            this.dialogVisible = visible
          }}
          onClose={value => this.onDialogClose(value)}></options-dialog>
      </div>
    )
  },
})
