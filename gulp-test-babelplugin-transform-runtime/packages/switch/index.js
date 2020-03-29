// @ts-nocheck
/**
 * @desc Switch 开关选择按钮
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isEqual from 'lodash/isEqual'
import _isNil from 'lodash/isNil'

const FastSwitch = {
  name: 'FastSwitch',
  inheritAttrs: false,
  // 自定义组件 v-model 时对应的 prop 和 event
  model: {
    prop: 'value',
    event: 'switchChange'
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
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
     * @desc switch 状态发生变化时的回调函数
     * @event FastSwitch#_changeEvent
     * @param {boolean} value - 新状态的值
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
     * @desc v-model
     * @event FastSwitch#_switchChangeEvent
     * @param {boolean} value - 新状态的值
     */
    _switchChangeEvent (value) {
      // 事件监听
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'switchChange')
      ) {
        this.listeners.switchChange(value)
        return
      }
      // v-model
      this.$emit('switchChange', value)
    },
    /**
   * @desc 使 input 获取焦点
   * @method
   */
    focus () {
      this.$refs[`${this._uid}-el-switch-ref`].focus()
    }
  },
  render (h) {
    // v-if
    if (_isEqual(this.isRender, false)) {
      return h()
    }
    const style = { ..._get(this.$props, 'ctStyle', {}) }
    // v-show
    if (_isEqual(this.isDisplay, false)) {
      _set(style, 'display', 'none')
    }
    return h('el-switch', {
      ref: `${this._uid}-el-switch-ref`,
      class: _get(this.$props, 'ctCls', {}),
      style,
      attrs: {
        id: this.$attrs.id
      },
      props: { ...this.$attrs, value: this.vValue },
      on: {
        input: val => {
          this.vValue = val
          this._switchChangeEvent(this.vValue)
        },
        change: this._changeEvent
      }
    })
  }
}
FastSwitch.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastSwitch.name + '----install----')
  Vue.component(FastSwitch.name, FastSwitch)
}
export default FastSwitch
