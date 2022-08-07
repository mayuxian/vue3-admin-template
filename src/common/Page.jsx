import HeaderQuerier from '@/components/HeaderQuerier'
export default defineComponent({
  components: {
    HeaderQuerier,
  },
  props: {
    request: {
      type: [Function],
      default: null,
    },
    filterFields: {
      type: Array,
      default: null,
    },
    filterListOptions: {
      type: Object,
      default: null,
    },
    tableColumns: {
      type: Array,
      default: () => null,
    },
  },
  setup(props: any, ctx: any) {
    const createParamsRaw = () => ({
      current: 1,
      pageNum: 1,
      pageSize: 10,
      size: 10,
    })
    const tableLoading = ref(false)
    const data = reactive({
      filterParams: createParamsRaw(),
      tableData: [],
    })
    const pager = reactive({
      total: undefined,
      size: 10,
      current: 1,
    })
    async function init() {
      try {
        if (!props.request) {
          throw new Error('请配置request请求参数')
        }
        console.log(props.tableColumns)
        tableLoading.value = true
        const resData = await props.request(data.filterParams, init)
        data.tableData = resData?.list
        pager.total = resData.total
      } catch (err: any) {
        ElMessage.error(err?.message)
      } finally {
        tableLoading.value = false
      }
    }
    init();

    //#region 事件
    function pagelog(args: any) {
      console.log('args', args)
    }
    function renderCell(row: any, column: any, index: any, scope: any, slots: any) {
      console.log('scope', scope)
      console.log('slots', slots)
      const value: any = row[column.property]
      const defaultVal = column?.formatter
        ? column.formatter(row, column, value, index)
        : value?.toString?.() || ''
      return defaultVal
    }
    function onQuery(params: any) {
      data.filterParams = createParamsRaw()
      Object.assign(data.filterParams, params)
      init()
    }
    function onReset() {
      data.filterParams = createParamsRaw()
      init()
    }
    function onSkipPage(pageNum = 1) {
      pager.current = pageNum
      data.filterParams.pageNum = pageNum
      init()
    }
    function onSkipSize(size = 10) {
      pager.size = size
      data.filterParams.pageSize = size
      data.filterParams.pageNum = 1
      init()
    }
    function loadIndex(index: number) {
      return pager?.size * (pager.current - 1) + index + 1
    }
    defineExpose({
      init,
    })
  },
  render() {
    return (
      <div class="page-table">
        <HeaderQuerier
          style="margin-top: 10px"
          vModel={this.data.filterParams}
          fieldOptions={this.filterFields}
          listOptions={this.filterListOptions}
          query={this.onQuery}
          reset={this.onReset}
        >
          <slot name="query" />
        </HeaderQuerier>
        <div style="position: relative; float: right; top: -42px"
        ><slot name="query-right"
          /></div>
        <div class="page-table-box">
          <el-table
            v-loading="tableLoading"
            data={this.data.tableData}
            stripe
            border
            default-expand-all
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              index={this.loadIndex}
            />
            
            <slot name="table-columns" />
          </el-table>
          <Pagination
            total={this.pager.total}
            pageSize={this.pager.size}
            currentPage={this.pager.current}
            currentChange={this.onSkipPage}
            sizeChange={this.onSkipSize}
          />
        </div>
      </div>)
  }
})

