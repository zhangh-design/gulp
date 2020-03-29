/**
 * @desc input 文本域输入控件
 */
import { devConsole } from '../helper/util.js'
import FastTextInput from '../text-input/index.js'

const FastTextArea = {
  name: 'FastTextArea',
  extends: FastTextInput,
  props: {
    type: {
      type: String,
      default: 'textarea'
    },
    resize: {
      type: String,
      default: 'both',
      validator: function (value) {
        return ['none', 'both', 'horizontal', 'vertical'].includes(value)
      }
    }
  }
}
FastTextArea.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastTextArea.name + '----install----')
  Vue.component(FastTextArea.name, FastTextArea)
}
export default FastTextArea
