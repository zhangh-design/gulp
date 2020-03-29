// @ts-nocheck
/**
 * @desc fastElementUI 框架插件初始化入口
 * 用于一次性加载所有控件
 * 完整引入
 */
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import { devConsole } from './helper/util.js'
// Form表单子控件
import FastColor from './color/index.js'
import FastComboBox from './combo-box/index.js'
import FastDatePicker from './date-picker/index.js'
import FastDateTimePicker from './date-time-picker/index.js'
import FastInputNumber from './input-number/index.js'
import FastLabel from './label/index.js'
import FastRadio from './radio/index.js'
import FastSwitch from './switch/index.js'
import FastTextArea from './text-area/index.js'
import FastTextHidden from './text-hidden/index.js'
import FastTextInput from './text-input/index.js'
import FastTextPassword from './text-password/index.js'
import FastCheckbox from './checkbox/index.js'
import FastButton from './button/index.js'

// 表单
import FastForm from './form/index.js'

// 布局组件
import FastBorderLayout from './border-layout/index.js'
import FastFitLayout from './fit-layout/index.js'

// 数据表格组件
import FastGrid from './grid/index.js'

// 面板
import FastPanel from './panel/index.js'

const allComponents = {
  FastColor,
  FastComboBox,
  FastDatePicker,
  FastDateTimePicker,
  FastInputNumber,
  FastLabel,
  FastRadio,
  FastSwitch,
  FastTextArea,
  FastTextHidden,
  FastTextInput,
  FastTextPassword,
  FastCheckbox,
  FastButton,
  FastForm,
  FastBorderLayout,
  FastFitLayout,
  FastGrid,
  FastPanel
}
/**
 * @typedef {Object} options - 选项配置对象
 * @property {Object} globalOptions - 框架全局配置对象
 */
/**
 * @desc 插件入口
 * @param {Object} Vue
 * @param {options} [options={globalOptions: {}}] - 选项配置
 */
function install(Vue, options = { globalOptions: {} }) {
  // 组件
  for (const [key, value] of Object.entries(allComponents)) {
    devConsole('all import '+key)
    Vue.component(key, value)
  }

  // 全局配置参数
  const defaultGlobalOptions = {
    grid: {
      page: 'page',
      size: 'size',
      total: 'total',
      data: 'data'
    }
  }
  Object.defineProperty(Vue.prototype, '$fast-global-options', {
    value: _merge({}, defaultGlobalOptions, _get(options, 'globalOptions', {}))
  })
}

export const exportComponent = { install, ...allComponents }

export default {
  install,
  ...allComponents
}
