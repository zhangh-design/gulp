/**
 * DateTimePicker 日期时间选择器
 */
import { devConsole } from '../helper/util.js'
import FastDatePicker from '../date-picker/index.js'

const FastDateTimePicker = {
  name: 'FastDateTimePicker',
  extends: FastDatePicker,
  props: {
    type: {
      type: String,
      default: 'datetime'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    }
  }
}
FastDateTimePicker.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastDateTimePicker.name + '----install----')
  Vue.component(FastDateTimePicker.name, FastDateTimePicker)
}
export default FastDateTimePicker
