interface WebResponse<T = any> {
  code: number
  msg: string
  data?: T
}

interface PagingParam {
  pageNum?: number
  pageSize?: number
}
//Partial是ts内置的，可直接使用功能
// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };
