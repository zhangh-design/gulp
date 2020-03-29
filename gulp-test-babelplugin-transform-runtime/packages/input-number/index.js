// @ts-nocheck
/**
 * InputNumber 计数器
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isNil from 'lodash/isNil'
import _isEqual from 'lodash/isEqual'

const FastInputNumber = {
  name: 'FastInputNumber',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'inputNumberChange'
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: 'auto'
    },
    ctStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    ctCls: {
      type: Object,
      default () {
        return {}
      }
    },
    isRender: {
      type: Boolean,
      default: true
    },
    isDisplay: {
      type: Boolean,
      default: true
    },
    listeners: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      vValue: this.value
    }
  },
  watch: {
    value (value, oldValue) {
      if (value !== oldValue && this.vValue !== value) {
        this.vValue = value
      }
    }
  },
  methods: {
    /**
     * @desc 在组件 Input 失去焦点时触发
     * @event FastInputNumber#_blurEvent
     * @param {*} event
     */
    _blurEvent (event) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'blur')
      ) {
        this.listeners.blur(event)
        return
      }
      this.$emit('blur', event)
    },
    /**
     * @desc 在组件 Input 获得焦点时触发
     * @event FastInputNumber#_focusEvent
     * @param {*} event
     */
    _focusEvent (event) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'focus')
      ) {
        this.listeners.focus(event)
        return
      }
      this.$emit('focus', event)
    },
    /**
     * @desc 绑定值被改变时触发
     * @event FastInputNumber#_changeEvent
     * @param {number} value
     */
    _changeEvent (value) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'change')
      ) {
        this.listeners.change(value)
        return
      }
      this.$emit('change', value)
    },
    /**
     * @desc input 值改变时触发 v-model
     * @event FastInputNumber#_inputChangeEvent
     * @param {number} value - input 值
     */
    _inputChangeEvent (value) {
      // 事件监听
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'inputNumberChange')
      ) {
        this.listeners.inputNumberChange(value)
        return
      }
      // v-model
      this.$emit('inputNumberChange', value)
    },
    /**
     * @desc 使 input 获取焦点
     * @method
     */
    focus () {
      this.$refs[`${this._uid}-el-input-number-ref`].focus()
    },
    /**
     * @desc 选中 input 中的文字
     * @method
     */
    select () {
      this.$refs[`${this._uid}-el-input-number-ref`].select()
    }
  },
  render (h) {
    // v-if
    if (_isEqual(this.isRender, false)) {
      return h()
    }
    const style = { ..._get(this.$props, 'ctStyle', {}) }
    if (this.width !== 'auto') {
      style.width = this.width
    }
    // v-show
    if (_isEqual(this.isDisplay, false)) {
      _set(style, 'display', 'none')
    }
    return h('el-input-number', {
      ref: `${this._uid}-el-input-number-ref`,
      class: _get(this.$props, 'ctCls', {}),
      style,
      attrs: {
        id: this.$attrs.id
      },
      props: { ...this.$attrs, value: this.vValue },
      on: {
        blur: this._blurEvent,
        focus: this._focusEvent,
        change: this._changeEvent,
        input: value => {
          // v-model
          this.vValue = value
          this._inputChangeEvent(this.vValue)
        }
      }
    })
  }
}
FastInputNumber.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastInputNumber.name + '----install----')
  Vue.component(FastInputNumber.name, FastInputNumber)
}
export default FastInputNumber
