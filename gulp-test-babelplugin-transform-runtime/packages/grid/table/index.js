// @ts-nocheck
/**
 * Table 表格组件
 */
import FastMenu from '../../menu/index.js'
import _omit from 'lodash/omit'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _has from 'lodash/has'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import _some from 'lodash/some'
import _find from 'lodash/find'
import _isNil from 'lodash/isNil'
import _assign from 'lodash/assign'

const FastGridTable = {
  name: 'FastGridTable',
  inject: ['getFastGrid'],
  props: {
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
    // 过滤返回数据（该函数带一个参数'data'用来指向源数据）
    loadFilter: {
      type: Function,
      default: (data) => data
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否多选
    selectMode: {
      type: Boolean,
      default: false
    },
    // 是否显示index下标列
    isShowIndex: {
      type: Boolean,
      default: false
    },
    // 外部样式
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
    // 默认选择第一行
    isSelectedFirstRow: {
      type: Boolean,
      default: true
    },
    // 第一次载入时是否自动刷新列表数据
    isReloadGrid: {
      type: Boolean,
      default: true
    },
    // Table Slot
    slotNode: {
      type: Object,
      default () {
        return {}
      }
    },
    // 行右键菜单栏
    menu: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    this.curQueryParams = {}
    this.loading = null
    this.currentRows = [] // 当前选中行集
    this.ctxMenu = null // 右键菜单menu
    return {
      currentRow: {}, // 当前选中行
      tableData: []
    }
  },
  computed: {
    // 构建列 el-table-column
    tableColumnNodes () {
      return _map(this.columns, elem => {
        let filterMethod = null
        if (_has(elem, 'filters') && _has(elem, 'filter-method')) {
          filterMethod = function (value, row, column) {
            return elem['filter-method'](value, row, column)
          }
        }
        if (_has(elem, 'filters') && !_has(elem, 'filter-method')) {
          filterMethod = function (value, row, column) {
            const property = column['property']
            return row[property] === value
          }
        }
        return this.$createElement('el-table-column', {
          props: {
            ..._omit(elem, ['name', 'render', 'renderHeader', 'prop']),
            prop: elem['name'],
            'filter-method': filterMethod
          },
          scopedSlots: {
            default: ({ row, column, $index }) => {
              // 自定义列的内容
              if (_has(elem, 'render')) {
                return elem.render(
                  this.$createElement,
                  row,
                  column.property,
                  $index
                )
              } else if (_has(elem, 'slotNode')) {
                return _map(elem.slotNode, ({ render }) => {
                  return render(this.$createElement)
                })
              } else {
                return row[column.property]
              }
            },
            header: ({ column, $index }) => {
              // 自定义表头的内容 不能和属性 `render-header`一起使用否则起效的是`render-header`
              if (_has(elem, 'renderHeader')) {
                return elem.renderHeader(this.$createElement, column, $index)
              } else {
                return column.label
              }
            }
          }
        })
      })
    },
    // Table Slot
    appendNode () {
      return _has(this.$props, 'slotNode.append')
        ? [this.$props.slotNode.append(this.$createElement)]
        : []
    },
    // 多选 el-table-column
    multipleSelectNode () {
      return this.selectMode
        ? this.$createElement('el-table-column', {
          props: { type: 'selection', width: '50px' }
        })
        : []
    },
    // 下标列
    indexColumn () {
      return this.isShowIndex
        ? this.$createElement('el-table-column', {
          props: { type: 'index', width: '50px' }
        })
        : []
    },
    // 单选设置行选中
    _highlightCurrentRow () {
      return !this.selectMode
    }
  },
  watch: {
    // 更新选中行
    currentRow (val) {
      this.getFastGrid.updateCurrentRow(val)
    },
    // 监测数据源
    tableData (val) {
      if (this.isSelectedFirstRow && !_isEmpty(val)) {
        setTimeout(() => {
          if (this.selectMode) {
            this.$refs[`${this._uid}-fast-table`].toggleRowSelection(
              this.tableData[0]
            )
          } else {
            this.currentRow = this.tableData[0]
            this.$refs[`${this._uid}-fast-table`].setCurrentRow(
              this.tableData[0]
            )
          }
        }, 0)
      }
      if (_isEmpty(val)) {
        this.currentRow = {}
        this.currentRows = []
      }
      // 数据加载完成
      this.getFastGrid.onLoadSuccess(val)
    }
  },
  mounted () {
    if (_has(this.getFastGrid.$listeners, 'onBeforeLoad')) {
      let result = this.getFastGrid.$listeners.onBeforeLoad()
      if (result !== false) {
        this.init()
      }
    } else {
      this.init()
    }
    this.getFastGrid.setTableEl(this)
  },
  beforeDestroy () {
    if (this.ctxMenu != null) {
      this.ctxMenu.removeMenuNode()
      this.ctxMenu = null
    }
  },
  methods: {
    /**
     * @desc 当某一行被双击时会触发该事件
     * @event FastGridTable#_rowDblclickEvent
     * @param {Object} row - 行数据对象
     * @param {Object} column - 列对象 例如：{label: "地址", id: "el-table_1_column_4", property: "address"}
     * @param {*} event - 点击事件对象
     */
    _rowDblclickEvent (row, column, event) {
      if (_has(this.getFastGrid.$listeners, 'row-dblclick')) {
        this.getFastGrid.$emit('row-dblclick', row, column, event)
      } else {
        // 默认 el-dialog 打开弹框详情页
      }
    },
    /**
     * @desc 当选择项发生变化时会触发该事件
     * @event FastGridTable#_selectionChangeEvent
     * @param {Array} selection - 勾选中的行集合
     */
    _selectionChangeEvent (selection) {
      this.currentRows = selection
      if (_has(this.getFastGrid.$listeners, 'selection-change')) {
        this.getFastGrid.$emit('selection-change', selection)
      }
    },
    /**
     * @desc 当某一行被鼠标右键点击时会触发该事件（右键添加菜单栏）
     * @event FastGridTable#_rowContextmenuEvent
     * @param {Object} row - 行数据对象
     * @param {Object} column - 列对象 例如：{label: "地址", id: "el-table_1_column_4", property: "address"}
     * @param {*} event - 点击事件对象
     */
    _rowContextmenuEvent (row, column, event) {
      if (_has(this.getFastGrid.$listeners, 'row-contextmenu')) {
        this.getFastGrid.$emit('row-contextmenu', row, column, event)
      } else {
        if (!_isEmpty(this.menu)) {
          if (_isNil(this.ctxMenu)) {
            this.ctxMenu = new FastMenu()
          }
          this.ctxMenu.add(this.menu)
          this.ctxMenu.showAt(event.pageX, event.pageY)
        }
        event.preventDefault()
        event.stopPropagation()
      }
    },
    /**
     * @desc 当某一行被点击时会触发该事件
     * @event FastGridTable#_rowClickEvent
     * @param {Object} row - 行数据对象
     * @param {Object} column - 列对象 例如：{label: "地址", id: "el-table_1_column_4", property: "address"}
     * @param {*} event - 点击事件对象
     */
    _rowClickEvent (row, column, event) {
      if (!_isNil(this.ctxMenu)) {
        this.clearContextmenu()
      }
      if (!this.selectMode) {
        this.currentRow = row
      }
      if (_has(this.getFastGrid.$listeners, 'row-click')) {
        this.getFastGrid.$emit('row-click', row, column, event)
      }
    },
    /**
     * @desc 初始化
     * @method
     */
    init () {
      this.isReloadGrid && this.loadData()
    },
    /**
     * @desc 加载数据
     * @method
     */
    loadData () {
      if (!this.api) {
        return
      }
      this.loadMask()
      let params = _assign(
        {},
        {
          [_get(this['$fast-global-options'], 'grid.page', 'page')]: this.getFastGrid.currentPage - 1,
          [_get(this['$fast-global-options'], 'grid.size', 'size')]: this.getFastGrid.pageSize
        },
        this.queryParams,
        this.curQueryParams
      )
      this.$api[this.api]({ params })
        .then(response => {
          this.getFastGrid.setTotal(response[_get(this['$fast-global-options'], 'grid.total', 'total')] || 0)
          const data = response[_get(this['$fast-global-options'], 'grid.data', 'data')]
          this.tableData = _isNil(this.loadFilter) ? data : this.loadFilter(data)
        })
        .catch(error => {
          this.getFastGrid.onLoadError()
          throw new Error(error)
        })
        .finally(() => {
          this.loading.close()
        })
    },
    /**
     * @desc 设置查询参数
     * @param {Object} params
     */
    setQueryParams (params = {}) {
      this.curQueryParams = {}
      return Object.assign(this.curQueryParams, params)
    },
    /**
     * @desc 获取 el-table 组件
     * @method
     */
    getEl () {
      return this.$refs[`${this._uid}-fast-table`]
    },
    /**
     * @desc 显示加载中遮罩
     * @method
     */
    loadMask () {
      this.loading = this.$loading({
        lock: true,
        target: this.$el
      })
    },
    /**
     * @desc 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
     * @param {Array} field=[] - 行选中的配置数组对象
     * @type {Object}
     * @property {string} field='id' - 字段key
     * @property {string} value - 字段值
     * @property {Boolean} selected=true - 是否选中（未实现）
     * @method
     * @example
     * // 选中数据data数组中键为id和值等于100的行
     * toggleRowSelection([{field: 'id', value: '100', selected: true}])
     */
    toggleRowSelection (rows = []) {
      if (!this.selectMode) {
        return
      }
      const selectRows = _filter(this.tableData, item => {
        return _some(rows, function (row) {
          return item[row.field || 'id'] === row.value
        })
      })
      if (!_isEmpty(selectRows)) {
        for (let selectRow of selectRows.values()) {
          this.$refs[`${this._uid}-fast-table`].toggleRowSelection(selectRow)
        }
      }
    },
    /**
     * @desc 用于多选表格，切换所有行的选中状态
     * @method
     */
    toggleAllSelection () {
      if (!this.selectMode) {
        return
      }
      this.$refs[`${this._uid}-fast-table`].toggleAllSelection()
    },
    /**
     * @desc 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
     * @param {Object} row={} - 行选中的配置对象
     * @type {Object}
     * @property {string} field='id' - 字段key
     * @property {string} value - 字段值
     * @method
     * @example
     * setCurrentRow({ field: 'id', value: 2 })
     */
    setCurrentRow (row = {}) {
      if (this.selectMode) {
        return
      }
      const selectRow = _find(this.tableData, item => {
        return item[row.field || 'id'] === row.value
      })
      if (!_isEmpty(selectRow)) {
        if (this.selectMode) {
          this.$refs[`${this._uid}-fast-table`].toggleRowSelection(selectRow)
        } else {
          this.currentRow = selectRow
          this.$refs[`${this._uid}-fast-table`].setCurrentRow(selectRow)
        }
      }
    },
    /**
     * @desc 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
     * @param {Array} columnKey=[] - columnKey组成的数组以清除指定列的过滤条件
     * @method
     */
    clearFilter (columnKey = []) {
      if (!_isEmpty(columnKey)) {
        for (let elem of columnKey.values()) {
          this.$refs[`${this._uid}-fast-table`].clearFilter(elem)
        }
      } else {
        this.$refs[`${this._uid}-fast-table`].clearFilter()
      }
    },
    /**
     * @desc 清除右键添加的菜单栏
     * @method
     */
    clearContextmenu () {
      if (this.ctxMenu != null) {
        this.ctxMenu.removeMenuNode()
        setTimeout(() => {
          this.ctxMenu = null
        }, 0);
      }
    },
    /**
     * @desc 清空表单
     * @method
     */
    clearTable () {
      this.tableData = []
    },
    /**
     * @desc 获取当前选中行
     * @method
     * @returns {Object}
     */
    getSelectedRow () {
      return this.currentRow
    },
    /**
     * @desc 获取当前选中行集
     * @method
     * @returns {Array}
     */
    getSelectedRows () {
      return this.currentRows
    }
  },
  render (h) {
    return h(
      'el-table',
      {
        ref: `${this._uid}-fast-table`,
        class: _get(this.$props, 'ctCls', {}),
        style: { ..._get(this.$props, 'ctStyle', {}), width: '100%' },
        props: {
          ...this.$attrs,
          height: '100%', // 实现固定表头的表格，数据可滚动
          highlightCurrentRow: this._highlightCurrentRow,
          data: this.tableData
        },
        on: {
          ..._omit(this.getFastGrid.$listeners, [
            'selection-change',
            'row-contextmenu',
            'row-dblclick',
            'row-click'
          ]),
          'selection-change': this._selectionChangeEvent,
          'row-contextmenu': this._rowContextmenuEvent,
          'row-dblclick': this._rowDblclickEvent,
          'row-click': this._rowClickEvent
        }
      },
      [
        this.indexColumn,
        this.multipleSelectNode,
        this.tableColumnNodes,
        h('template', { slot: 'append' }, this.appendNode)
      ]
    )
  }
}
export default FastGridTable
