// @ts-nocheck
/**
 * Select 选择器
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import _set from 'lodash/set'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _assign from 'lodash/assign'

const FastComboBox = {
  name: 'FastComboBox',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'selectChange'
  },
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    },
    api: {
      type: String,
      default: ''
    },
    queryParams: {
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
    loadFilter: {
      type: Function,
      default: null
    },
    displayField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'id'
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
    this.vQueryParams = (_isEmpty(this.api)) ? {} : { ...this.queryParams };
    this.vValue = this.multiple ? [...this.value] : this.value;
    return {
      vOptions: (_isEmpty(this.api)) ? [...this.options] : []
    }
  },
  computed: {
    elOptions () {
      const elOptions = this.vOptions.map(option => {
        return this.$createElement('el-option', {
          props: {
            key: option[this.valueField],
            label: option[this.displayField],
            value: option[this.valueField],
            disabled: option.disabled
          }
        })
      })
      return elOptions
    },
    slotElement () {
      const nodes = []
      if (!_isEmpty(this.slotNode)) {
        for (let [key, elem] of Object.entries(this.slotNode)) {
          nodes.push(this.$createElement('template', { slot: key }, [
            this.$createElement('span', { domProps: { innerHTML: elem.template } })
          ]))
        }
      }
      return nodes
    }
  },
  watch: {
    value (value, oldValue) {
      if (!_isEqual(value, oldValue) && !_isEqual(this.vValue, value)) {
        this.vValue = value
        this._changeEvent(this.vValue)
        this._selectChangeEvent(this.vValue)
      }
    },
    api: {
      handler: '_fetchList',
      immediate: true
    }
  },
  methods: {
    /**
   * @desc 获取远程服务器数据的操作
   * @method
   */
    _fetchList () {
      if (_isEmpty(this.api) || _isNil(this.$api)) {
        return
      }
      this.$api[this.api](this.vQueryParams).then(resData => {
        if (!_isNil(this.loadFilter)) {
          resData = this.loadFilter(resData.data)
        }
        this.vOptions = resData.data
      }).catch((error) => {
        console.error(error)
      })
    },
    /**
     * @desc 选中值发生变化时触发
     * @event FastComboBox#_changeEvent
     * @param {Array} value - 选中项
     */
    _changeEvent (value) {
      const v = (this.multiple) ? [...value] : value;
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'change')
      ) {
        this.listeners.change(v)
        return
      }
      this.$emit('change', v)
    },
    /**
     * @desc 下拉框出现/隐藏时触发
     * @event FastComboBox#_visibleChangeEvent
     * @param {boolean} value
     */
    _visibleChangeEvent (value) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'visible-change')
      ) {
        this.listeners['visible-change'](value)
        return
      }
      this.$emit('visible-change', value)
    },
    /**
     * @desc 多选模式下移除tag时触发
     * @event FastComboBox#_removeTag
     * @param {*} value
     */
    _removeTag (value) {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'remove-tag')
      ) {
        this.listeners['remove-tag'](value)
        return
      }
      this.$emit('remove-tag', value)
    },
    /**
     * @desc 可清空的单选模式下用户点击清空按钮时触发
     * @event FastComboBox#_clearEvent
     */
    _clearEvent () {
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'clear')
      ) {
        this.listeners.clear()
        return
      }
      this.$emit('clear')
    },
    /**
     * @desc 当 input 失去焦点时触发
     * @event FastComboBox#_blurEvent
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
     * @desc 当 input 获得焦点时触发
     * @event FastComboBox#_focusEvent
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
     * @desc 下拉选择项发生改变时
     * @event FastInput#_selectChangeEvent
     * @param {Array} value - 选中项
     */
    _selectChangeEvent (value) {
      const v = (this.multiple) ? [...value] : value;
      if (
        _isEqual(_isNil(this.listeners), false) &&
        Reflect.has(this.listeners, 'selectChange')
      ) {
        this.listeners.selectChange(v)
        return
      }
      // v-model
      this.$emit('selectChange', v)
    },
    /**
     * @desc 手动执行刷新数据操作
     * @method
     * @param {Object} params - 查询条件
     */
    reload (params = {}) {
      if (!_isEmpty(this.api)) {
        _assign(this.vQueryParams, params)
        this._fetchList()
      }
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
      'el-select',
      {
        ref: `${this._uid}-el-select-ref`,
        class: _get(this.$props, 'ctCls', {}),
        style,
        attrs: {
          id: this.$attrs.id
        },
        props: { ...this.$attrs, value: this.vValue },
        on: {
          change: this._changeEvent,
          'visible-change': this._visibleChangeEvent,
          'remove-tag': this._removeTag,
          clear: this._clearEvent,
          blur: this._blurEvent,
          focus: this._focusEvent,
          input: val => {
            // v-model
            this.vValue = val
            this._selectChangeEvent(this.vValue)
          }
        }
      },
      [this.elOptions, this.slotElement]
    )
  }
}
FastComboBox.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastComboBox.name + '----install----')
  Vue.component(FastComboBox.name, FastComboBox)
}
export default FastComboBox
