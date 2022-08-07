export const tableColumns = [
  {
    label: '角色名称',
    prop: 'name',
  },
]

export const filterFields: Array<FilterFieldType> = [
  {
    label: '姓名',
    model: 'nickname',
    componentName: 'el-input',
    componentProps: {
      placeholder: '',
      clearable: true,
    },
  },
]
