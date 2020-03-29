/**
 * @desc panel 面板组件
 */
import { devConsole } from '../helper/util.js'
import _get from 'lodash/get'
import _has from 'lodash/has'
import _set from 'lodash/set'
import _isEqual from 'lodash/isEqual'
import _isArray from 'lodash/isArray'
import _isEmpty from 'lodash/isEmpty'

const FastPanel = {
  name: 'FastPanel',
  inheritAttrs: false,
  provide: function () {
    return {
      getPanel: this
    }
  },
  props: {
    // 布局组件（外部传入）
    layout: {
      type: [Object, String],
      default () {
        return null
      }
    },
    // 选定好layout布局后，其相应的配置属性就在这个对象上进行设置。（即与layout配置联合使用）
    layoutConfig: {
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
    }
  },
  data () {
    this.childElements = [] // 内容面板子组件元素
    return {
    }
  },
  mounted () {
    console.info('aaaaaa ', this.layout)
    console.info('slot.north', this.$slots)
  },
  methods: {
    /**
     * @desc 添加 content 内容面板
     * @param {Array|Object} panel - 面板对象
     * @type {object}
     * @property {Object} component - 组件对象
     * @property {Object} class - css样式 {foo: true, bar: false}
     * @property {Object} style - 内联样式 {color: 'red',fontSize: '14px'}
     * @property {Object} props - props 传参
     * @property {Array} children - 子组件对象列表
     * @example
     */
    add (panels = []) {
      const nodes = _isArray(panels) ? panels : [panels]
      for (let panel of nodes.values()) {
        this.childElements.push(
          this.$createElement(_get(panel, 'component', null),
            {
              class: _get(panel, 'class', {}),
              style: { ..._get(panel, 'style', {}), height: '100%' },
              props: _get(panel, 'props', {}),
              slot: _get(panel, 'slot', 'default')
            },
            _has(panel, 'children') ? _get(panel, 'children', []) : []
          ))
      }
      if (!_isEmpty(nodes)) {
        this.$forceUpdate()
      }
    }
  },
  render (h) {
    // v-if
    if (_isEqual(this.isRender, false)) {
      return h()
    }
    const style = {}
    // v-show
    if (_isEqual(this.isDisplay, false)) {
      _set(style, 'display', 'none')
    }
    return h(
      this.layout,
      { ref: `${this._uid}-fast-panel`, style, props: this.layoutConfig },
      [
        h('template', { slot: 'north' }, this.$slots.north),
        h('template', { slot: 'west' }, this.$slots.west),
        h('template', { slot: 'east' }, this.$slots.east),
        h('template', { slot: 'center' }, this.$slots.center),
        h('template', { slot: 'south' }, this.$slots.south),
        h('template', { slot: 'default' }, this.$slots.default),
        this.childElements
      ]
    )
  }
}
FastPanel.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastPanel.name + '----install----')
  Vue.component(FastPanel.name, FastPanel)
}
export default FastPanel
