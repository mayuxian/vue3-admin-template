import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export default createSvgIconsPlugin({
  iconDirs: [resolve(process.cwd(), 'src/assets/icons/svgs')],
  svgoOptions: true, //默认true，压缩svg
  symbolId: 'icon-[dir]-[name]',
})
