// @ts-nocheck
/**
 * Pagination 分页
 */
import _set from 'lodash/set'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _has from 'lodash/has'

const FastGridPagination = {
  name: 'FastGridPagination',
  inject: ['getFastGrid'],
  props: {
    total: {
      type: Number
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, sizes, slot, ->, total'
    },
    // 是否显示分页数量选择器
    isShowPagination: {
      type: Boolean,
      default: true
    },
    // 可拓展按钮
    pagingItems: {
      type: Array,
      default () {
        /* [{text: '同步',listeners: {
              click: ()=>{}
          }},{text: '刷新'}] */
        return []
      }
    }
  },
  data () {
    return {}
  },
  created () {
    this.getFastGrid.setPaginationEl(this)
  },
  methods: {
    /**
     * @desc 自定义内容，需要在 layout 中列出 slot
     * @method
     */
    createPagingItemsNodes () {
      const nodes = []
      for (let item of this.pagingItems.values()) {
        const h = this.$createElement(
          'span',
          {
            style: { 'font-size': (_has(item, 'icon') && !_isEmpty(item.icon)) ? '16px' : '12px', cursor: 'pointer' },
            class: { [_get(item, 'icon', '')]: true },
            attrs: { title: _get(item, 'text', '') },
            on: _get(item, 'listeners', {})
          },
          (_has(item, 'icon') && !_isEmpty(item.icon)) ? null : item.text
        )
        nodes.push(h)
      }
      return nodes
    },
    /**
     * @desc 修改分页 current-page 参数
     * @param {Number} page 页数
     */
    updateCurrentPage (page) {
      this.currentPage = page
    },
    /**
     * @desc pageSize 改变时会触发
     * @param {number} pageSize - 每页条数
     * @event
     */
    _sizeChangeEvent (pageSize) {
      this.getFastGrid.onSizeChange(pageSize)
    },
    /**
     * @desc 用户点击上一页按钮改变当前页后触发
     * @param {number} page - 当前页
     * @event
     */
    _currentChangeEvent (page) {
      this.getFastGrid.onCurrentChange(page)
    },
    /**
     * @desc 点击刷新图标
     * @param {*} event - 点击事件对象
     * @event
     */
    _refreshEvent () {
      this.getFastGrid.loadGrid()
    }
  },
  render (h) {
    const style = {}
    // v-show
    if (_isEqual(this.isShowPagination, false)) {
      _set(style, 'display', 'none')
    }
    return h(
      'el-pagination',
      {
        style,
        props: {
          ...this.$attrs,
          layout: this.layout,
          total: this.total,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        },
        on: {
          'size-change': this._sizeChangeEvent,
          'current-change': this._currentChangeEvent
        }
      },
      [
        h('template', { slot: 'default' }, [
          h('span', {
            style: { 'font-size': '16px', cursor: 'pointer' },
            class: { 'el-icon-refresh': true },
            attrs: { title: '刷新' },
            on: {
              click: this._refreshEvent
            }
          }),
          this.createPagingItemsNodes()
        ])
      ]
    )
  }
}
export default FastGridPagination
