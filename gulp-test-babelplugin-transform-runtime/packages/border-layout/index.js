// @ts-nocheck
import { devConsole } from '../helper/util.js'
import BorderLayout from './border.vue'

BorderLayout.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(BorderLayout.name + '----install----')
  Vue.component(BorderLayout.name, BorderLayout)
}

export default BorderLayout
