export const tableColumns = [
  {
    label: '权限名称',
    prop: 'name',
  },
]

export const filterFields: Array<FilterFieldType> = [
  {
    label: '姓名',
    model: 'nickname',
    componentName: 'el-input',
    componentProps: {
      placeholder: '请输入角色名称',
      clearable: true,
    },
  },
]
