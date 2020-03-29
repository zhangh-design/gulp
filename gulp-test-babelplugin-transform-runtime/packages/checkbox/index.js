// @ts-nocheck
/**
 * @desc Checkbox 多选框
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isNil from 'lodash/isNil'
import _isEqual from 'lodash/isEqual'
import _omit from 'lodash/omit'

const FastCheckbox = {
  name: 'FastCheckbox',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'checkboxChange'
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
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
    options: {
      type: Array,
      default () {
        return []
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
  computed: {
    checkboxItems () {
      return this.options.map(option => {
        return this.$createElement(
          'el-checkbox',
          {
            props: {
              ..._omit(option, 'value'),
              label: option['value']
            }
          },
          [option['label']]
        )
      })
    }
  },
  watch: {
    value (value, oldValue) {
      if (!_isEqual(value, oldValue) && !_isEqual(this.vValue, value)) {
        this.vValue = value
        this._changeEvent(this.vValue)
        this._checkboxChangeEvent(this.vValue)
      }
    }
  },
  methods: {
    /**
     * @desc 当绑定值变化时触发的事件
     * @event FastCheckbox#_changeEvent
     * @param {Array} value - 更新后的值
     */
    _changeEvent (value) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'change')
      ) {
        this.listeners.change([...value])
        return
      }
      this.$emit('change', [...value])
    },
    /**
     * @desc 当绑定值变化时触发的事件 v-model
     * @event FastCheckbox#_checkboxChange
     * @param {Array} value - 更新后的值
     */
    _checkboxChangeEvent (value) {
      // 事件监听
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'checkboxChange')
      ) {
        this.listeners.checkboxChange([...value])
        return
      }
      // v-model
      this.$emit('checkboxChange', [...value])
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
    return h(
      'el-checkbox-group',
      {
        ref: `${this._uid}-el-checkbox-group-ref`,
        class: _get(this.$props, 'ctCls', {}),
        style,
        attrs: {
          id: this.$attrs.id
        },
        props: {
          ...this.$attrs,
          value: this.vValue
        },
        on: {
          change: this._changeEvent,
          input: value => {
            this.vValue = value
            this._checkboxChangeEvent(this.vValue)
          }
        }
      },
      this.checkboxItems
    )
  }
}

FastCheckbox.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastCheckbox.name + '----install----')
  Vue.component(FastCheckbox.name, FastCheckbox)
}

export default FastCheckbox
