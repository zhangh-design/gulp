// @ts-nocheck
/**
 * @desc  Radio 单选框
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isNil from 'lodash/isNil'
import _isEqual from 'lodash/isEqual'
import _omit from 'lodash/omit'

const FastRadio = {
  name: 'FastRadio',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'radioChange'
  },
  props: {
    value: {
      type: [String, Number, Boolean]
    },
    options: {
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
    radioItems () {
      return this.options.map(option => {
        return this.$createElement(
          'el-radio',
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
        this._radioChangeEvent(this.vValue)
      }
    }
  },
  methods: {
    /**
     * @desc 当绑定值变化时触发的事件
     * @event FastRadio#_changeEvent
     * @param {string|number|boolean} value - 更新后的值
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
     * @desc 当绑定值变化时触发的事件 v-model
     * @event FastRadio#_radioChangeEvent
     * @param {string|number|boolean} value - 更新后的值
     */
    _radioChangeEvent (value) {
      // 事件监听
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'radioChange')
      ) {
        this.listeners.radioChange(value)
        return
      }
      // v-model
      this.$emit('radioChange', value)
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
      'el-radio-group',
      {
        ref: `${this._uid}-el-radio-group-ref`,
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
            this._radioChangeEvent(this.vValue)
          }
        }
      },
      this.radioItems
    )
  }
}
FastRadio.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastRadio.name + '----install----')
  Vue.component(FastRadio.name, FastRadio)
}
export default FastRadio
