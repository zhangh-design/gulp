/**
 * label 普通文本标签组件
 */
import { devConsole } from '../helper/util.js'
import _isNil from 'lodash/isNil'
import _isEqual from 'lodash/isEqual'
import _set from 'lodash/set'

const FastLabel = {
  name: 'FastLabel',
  inheritAttrs: false,
  props: {
    labelStyle: {
      type: Object,
      default () {
        return { color: '#3F3F46', 'font-size': '12px' }
      }
    },
    labelClass: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    html: {
      type: String,
      default: ''
    },
    isDisplay: {
      type: Boolean,
      default: true
    },
    isRender: {
      type: Boolean,
      default: true
    },
    listeners: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    /**
   * @desc 在 Label 被点击时时触发
   * @event FastLabel#_clickEvent
   * @param {*} event
   */
    _clickEvent (event) {
      if (_isEqual(_isNil(this.listeners), false) && Reflect.has(this.listeners, 'click')) {
        this.listeners.click(event)
        return
      }
      this.$emit('click', event)
    }
  },
  render (h) {
    // v-if
    if (_isEqual(this.isRender, false)) {
      return h()
    }
    const style = { ...this.labelStyle }
    // v-show
    if (_isEqual(this.isDisplay, false)) {
      _set(style, 'display', 'none')
    }
    return h(
      'span',
      {
        ref: `${this._uid}-el-label-ref`,
        style,
        attrs: this.$attrs,
        class: this.labelClass,
        domProps: {
          innerHTML: (this.html.length === 0) ? this.text : this.html
        },
        on: {
          click: this._clickEvent
        }
      }
    )
  }
}
FastLabel.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastLabel.name + '----install----')
  Vue.component(FastLabel.name, FastLabel)
}
export default FastLabel
