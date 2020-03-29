// @ts-nocheck
import { devConsole } from '../helper/util.js'
import FormLayout from './form.vue'

FormLayout.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FormLayout.name + '----install----')
  Vue.component(FormLayout.name, FormLayout)
}

export default FormLayout
