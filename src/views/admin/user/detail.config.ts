const date = new Date()
export const detailConfig = [
  { label: '用户名', key: 'username' },
  { label: '姓名', key: 'nickname' },
  {
    label: '性别',
    key: 'sex',
    formatter: (val: any) => ['未知', '男', '女'][val],
  },
  {
    label: '年龄',
    key: 'age',
  },
  {
    label: '状态',
    key: 'state',
  },
  {
    label: '权限',
    key: 'roles',
  },
]
