import Vue from 'vue'
import { createApp } from 'vue'

export type DialogOptions = {
  zIndex?: number
}
export class createDialog {
  _root: any = null
  _dialog: any = null
  _dialogInst: any | null = null
  _data: object | undefined | null = null
  _options: DialogOptions | undefined | null = null
  constructor(
    component: any,
    data: object | undefined | null,
    options?: DialogOptions | undefined | null
  ) {
    this._data = data
    this._options = options
    this._dialog = createApp(component)
    this._root = document.createElement('div')
    document.body.appendChild(this._root)
    this._dialogInst = this._dialog.mount(this._root)
  }
  public showDialog() {
    return new Promise<any>((resolve, reject) => {
      const onClose = (cbData: any) => {
        this._dialog?.unmount && this._dialog?.unmount()
        document.body.removeChild(this._root)
        resolve(cbData)
      }
      this._dialogInst?.showDialog &&
        this._dialogInst.showDialog(this._data, onClose)
    })
  }
}
