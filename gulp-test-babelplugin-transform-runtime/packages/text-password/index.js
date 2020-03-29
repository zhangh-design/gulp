/**
 * @desc input 输入密码框控件
 */
import { devConsole } from '../helper/util.js'
import FastTextInput from '../text-input/index.js'

const FastTextPassword = {
  name: 'FastTextPassword',
  extends: FastTextInput,
  props: {
    type: {
      type: String,
      default: 'password'
    }
  }
}
FastTextPassword.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastTextPassword.name + '----install----')
  Vue.component(FastTextPassword.name, FastTextPassword)
}
export default FastTextPassword
