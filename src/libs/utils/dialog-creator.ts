import { createApp, Plugin } from 'vue'
import router from '@/router/index'
import store from '@/store/index'
export type DialogOptions = {
  zIndex?: number
  modal?: boolean
}
export class createDialog {
  _root: any = null
  _dialog: any = null
  _dialogInst: any | null = null
  _data: object | undefined | null = null
  _plugins: Plugin[] | undefined | null = undefined
  _options: DialogOptions = {}
  constructor(args?: {
    component: any
    data: object | undefined | null
    options?: DialogOptions | undefined | null
    plugins?: Plugin[]
  }) {
    this._data = args?.data
    this._plugins = args?.plugins
    Object.assign(
      this._options,
      {
        modal: true,
      },
      args?.options || {}
    )
    this._dialog = createApp(args?.component)
    this._dialog.use(store)
    this._dialog.use(router)
    this._plugins?.forEach((plugin: Plugin) => {
      this._dialog.use(plugin)
    })
    this._root = document.createElement('div')
    document.body.appendChild(this._root)
    this._dialogInst = this._dialog.mount(this._root)
  }
  public showDialog(opts?: DialogOptions | undefined | null) {
    Object.assign(this._options, opts || {})
    return new Promise<any>((resolve, reject) => {
      const onClose = (cbData: any) => {
        this._dialog?.unmount && this._dialog?.unmount()
        document.body.removeChild(this._root)
        resolve(cbData)
      }
      this._dialogInst?.showDialog &&
        this._dialogInst.showDialog(this._data, onClose, this._options)
    })
  }
}
