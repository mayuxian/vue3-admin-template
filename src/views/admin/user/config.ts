import dayjs from 'dayjs'
export const tableColumns = [
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '姓名',
    prop: 'nickname',
  },
  {
    label: '手机号',
    prop: 'phone',
  },
  {
    label: '角色',
    prop: 'roles',
  },
  {
    label: '创建日期',
    prop: 'createTime',
    formatter: (row: any, column: any, value: any) => {
      return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
    },
  },
]

export const filterFields: Array<FilterFieldType> = [
  {
    label: '用户名',
    model: 'username',
    componentName: 'el-input',
    componentProps: {
      placeholder: '请输入用户名',
      clearable: true,
    },
  },
  {
    label: '姓名',
    model: 'nickname',
    componentName: 'el-input',
    componentProps: {
      placeholder: '请输入姓名',
      clearable: true,
    },
  },
  {
    label: '手机号',
    model: 'phone',
    componentName: 'el-input',
    componentProps: {
      placeholder: '请输入手机号',
      clearable: true,
    },
  },
]
