// @ts-nocheck
/**
 * Button 按钮
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isNil from 'lodash/isNil'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'

const FastButton = {
  name: 'FastButton',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: ''
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
    icon: {
      type: String,
      default: ''
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: function (value) {
        return ['left', 'right'].includes(value)
      }
    },
    slotNode: {
      type: Object,
      default: () => {}
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
    this.events = { afterClickHandler: 'afterClickHandler' }
    return {}
  },
  methods: {
    /**
     * @desc 原生点击事件
     * @event FastButton#_nativeClickEvent
     * @param {*} event
     */
    _nativeClickEvent (event) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'click')
      ) {
        this.listeners.click(event)
      } else {
        this.$emit('click', event)
      }
      this.$emit(this.events.afterClickHandler, event)
    },
    /**
     * @desc 创建 el-button 控件的 slot 插槽
     * @param {*} h - 渲染函数
     * @method
     */
    _createChildSlotElement (h) {
      const nodes = []
      if (
        _isEmpty(this.slotNode) &&
        _isEmpty(this.$slots) &&
        !_isEmpty(this.text)
      ) {
        nodes.push(h('span', this.text))
      } else if (
        _isEmpty(this.$slots) &&
        _isEqual(_isEmpty(this.slotNode), false)
      ) {
        nodes.push(
          h('span', { domProps: { innerHTML: this.slotNode.template } })
        )
      } else if (_isEqual(_isEmpty(this.$slots), false)) {
        nodes.push(h('span', { slot: 'default' }, this.$slots.default))
      }
      if (this.iconPosition === 'right') {
        nodes.push(
          h('li', {
            class: {
              [this.icon]: true,
              'el-icon--right': true
            }
          })
        )
      }
      return nodes
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
    return h(
      'el-button',
      {
        ref: `${this._uid}-el-button-ref`,
        class: _get(this.$props, 'ctCls', {}),
        style,
        attrs: {
          id: this.$attrs.id
        },
        props: {
          ...this.$attrs,
          icon: this.iconPosition === 'right' ? null : this.icon
        },
        nativeOn: {
          click: this._nativeClickEvent
        }
      },
      this._createChildSlotElement(h)
    )
  }
}

FastButton.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastButton.name + '----install----')
  Vue.component(FastButton.name, FastButton)
}

export default FastButton
