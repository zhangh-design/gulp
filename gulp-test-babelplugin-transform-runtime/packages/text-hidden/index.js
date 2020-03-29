/**
 * @desc input 隐藏控件
 */
import { devConsole } from '../helper/util.js'
import FastTextInput from '../text-input/index.js'

const FastTextHidden = {
  name: 'FastTextHidden',
  extends: FastTextInput,
  props: {
    type: {
      type: String,
      default: 'hidden'
    }
  }
}
FastTextHidden.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastTextHidden.name + '----install----')
  Vue.component(FastTextHidden.name, FastTextHidden)
}
export default FastTextHidden
