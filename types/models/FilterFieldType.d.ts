interface FilterFieldType {
  label: string
  model: string
  componentName: string
  componentProps?: Partial<
    {
      placeholder: string
      clearable: boolean
      style: string
    } & any
  >
  hidden?: false
}
