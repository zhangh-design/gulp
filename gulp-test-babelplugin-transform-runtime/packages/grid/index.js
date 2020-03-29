/**
 * grid 列表组件
 * 全局组件
 */
import { devConsole } from '../helper/util.js'
import FastTable from './table/index.js'
import FastGridSearch from './search/index.js'
import FastTbar from './tbar/index.js'
import FastGridPagination from './pagination/index.js'
import _isEqual from 'lodash/isEqual'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _omit from 'lodash/omit'

const FastGrid = {
  name: 'FastGrid',
  provide () {
    return {
      getFastGrid: this
    }
  },
  components: {
    FastTable,
    FastGridSearch,
    FastGridPagination,
    FastTbar
  },
  props: {
    api: {
      type: String,
      required: true
    },
    queryParams: {
      type: Object,
      default () {
        return { }
      }
    },
    // 过滤返回数据（该函数带一个参数'data'用来指向源数据）
    loadFilter: {
      type: Function,
      default: (data) => data
    },
    // 列 el-table-column 的配置
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    // Table Attributes
    tableAttributes: {
      type: Object,
      default () {
        return {}
      }
    },
    // Pagination Attributes
    paginationAttributes: {
      type: Object,
      default () {
        return {}
      }
    },
    // 右键菜单栏 contextMenu
    menu: {
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
    // 是否显示分页数量选择器
    isShowPagination: {
      type: Boolean,
      default: true
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
    this.layout = 'border' // 布局
    this.fastGridTable = null // table 组件实例
    this.paginationInstance = null // Pagination 分页 组件实例
    this.events = {
      onLoadSuccess: 'onLoadSuccess', // 在数据加载成功的时候触发
      onLoadError: 'onLoadError', // 在载入远程数据产生错误的时候触发
      onBeforeLoad: 'onBeforeLoad', // 在载入请求数据之前触发，如果返回false可终止载入数据操作（验证参数）
      onChangeRowEvent: 'onChangeRowEvent' // 选中行事件-单选
    }
    return {
      currentRow: {}, // 当前选中行
      currentPage: _get(this.paginationAttributes, 'currentPage', 1), // 当前页数
      pageSize: _get(this.paginationAttributes, 'pageSize', 30), // 每页显示条目个数
      total: 0 // 总条目数
    }
  },
  watch: {
    paginationAttributes: {
      handler (val) {
        if (_has(val, 'pageSize')) {
          this.pageSize = val.pageSize
        }
        if (_has(val, 'currentPage')) {
          this.currentPage = val.currentPage
        }
      },
      immediate: true
    }
  },
  methods: {
    /** Table 表格组件 */
    /**
     * @desc 设置表格的总数量
     * @param {Number} num=0 - 数量
     */
    setTotal (num = 0) {
      this.total = num
    },
    /**
     * @desc 设置 FastGridTable 组件实例
     * @method
     * @param {Object} tableInstance - 组件实例对象 this
     */
    setTableEl (tableInstance) {
      this.fastGridTable = tableInstance
    },
    /**
     * @desc 设置查询参数
     * @param {Object} params - 查询对象参数
     */
    setQueryParams (params = {}) {
      this.getTable().setQueryParams(params)
    },
    /**
     * @desc 获取 FastGridTable 组件实例
     * @method
     * @returns {Object} FastGridTable组件的实例对象 this
     */
    getTable () {
      return this.fastGridTable
    },
    /**
     * @desc 获取 el-table 组件实例（用于直接操作 element-ui的el-table组件的方法）
     * @method
     * @returns {Object} el-table组件
     */
    getElTable () {
      return this.fastGridTable.getEl()
    },
    /**
     * @desc 获取查询总数
     * @method
     * @returns {Number} 总数
     */
    getTotal () {
      return this.total
    },
    /**
     * @desc 获取总页数
     * @method
     * @returns {Number} 总页数
     */
    getTotalPages () {
      return Math.ceil(this.total / this.pageSize)
    },
    /**
     * @desc 返回加载完毕后的数据
     * @method
     * @returns {Array}
     */
    getData () {
      return this.getTable().tableData
    },
    /**
     * @desc 返回单选选中的行-单选
     * @method
     * @returns {Object}
     */
    getSelected () {
      return this.getTable().getSelectedRow()
    },
    /**
     * @desc 返回复选时所有被选中的行-多选
     * @method
     * @returns {Array}
     */
    getSelections () {
      return this.getTable().getSelectedRows()
    },
    /**
     * @desc 选中一行
     * @method
     */
    selectRow (row = {}) {
      this.getTable().setCurrentRow(row)
    },
    /**
     * @desc 选择多行
     * @method
     */
    selectRows (rows = []) {
      this.getTable().toggleRowSelection(rows)
    },
    /**
     * @desc 选择当前页中所有的行
     */
    selectAll () {
      this.getTable().toggleAllSelection()
    },
    /**
     * @desc 用于多选表格，清空用户的选择
     * @method
     */
    clearSelections () {
      this.getElTable().clearSelection()
    },
    /**
     * @desc 清空表格
     * @method
     */
    clearGrid () {
      this.total = 0
      this.getTable().clearTable()
    },
    /**
     * @desc 刷新table组件，会回到第一页
     * @method
     */
    reloadGrid () {
      this.currentPage = 1
      this.getTable().loadData()
    },
    /**
     * @desc 刷新table组件，保留在当前页
     * @method
     */
    loadGrid () {
      this.getTable().loadData()
    },
    /** Pagination 分页组件 */
    /**
     * @desc 设置 FastGridPagination 组件实例
     * @method
     * @param {Object} paginationInstance - 组件实例对象 this
     */
    setPaginationEl (paginationInstance) {
      this.paginationInstance = paginationInstance
    },
    /**
     * @desc pageSize 改变时会触发
     * @param {number} pageSize - 每页条数
     * @method
     */
    onSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage === 1 || this.currentPage * pageSize <= this.total) {
        this.loadGrid()
      } else {
        this.currentPage = 1
      }
    },
    /**
     * @desc currentPage 改变时会触发
     * @param {number} page - 当前页
     * @method
     */
    onCurrentChange (page) {
      this.currentPage = page
      this.loadGrid()
    },
    /**
     * @desc 在数据加载成功的时候触发
     * @param {Array} table
     * @method
     */
    onLoadSuccess (table) {
      this.$emit(this.events.onLoadSuccess, table)
    },
    /**
     * @desc 在载入远程数据产生错误的时候触发
     * @method
     */
    onLoadError () {
      this.$emit(this.events.onLoadError)
    },
    /**
     * @desc 更新选中行
     * @param {Object} row - 选中行（如果是复选也只会是当前点击的这行）
     * @method
     */
    updateCurrentRow (row) {
      this.currentRow = row
      this.$emit(this.events.onChangeRowEvent, row)
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
      'fast-border-layout',
      {
        ref: `${this._uid}-fast-grid`,
        props: {
          border: true
        },
        nativeOn: {
          click: () => {
            this.getTable().clearContextmenu()
          }
        }
      },
      [
        h('fast-border-layout', { slot: 'north' }, [
          h(
            FastGridSearch,
            {
              slot: 'north',
              scopedSlots: {
                searchScope: () => {
                  if (_has(this.$scopedSlots, 'searchScope')) {
                    return this.$scopedSlots.searchScope(this.currentRow)
                  }
                  return h()
                }
              }
            },
            [h('template', { slot: 'default' }, this.$slots.search)]
          ),
          h(
            FastTbar,
            {
              slot: 'south',
              scopedSlots: {
                tbarScope: () => {
                  if (_has(this.$scopedSlots, 'tbarScope')) {
                    return this.$scopedSlots.tbarScope(this.currentRow)
                  }
                  return h()
                }
              }
            },
            [h('template', { slot: 'default' }, this.$slots.tbar)]
          )
        ]),
        h(FastTable, {
          slot: 'center',
          props: {
            api: this.api,
            queryParams: this.queryParams,
            columns: this.columns,
            isReloadGrid: this.isReloadGrid,
            isSelectedFirstRow: this.isSelectedFirstRow,
            menu: this.menu,
            isShowIndex: this.isShowIndex,
            selectMode: this.selectMode,
            loadFilter: this.loadFilter,
            ...this.tableAttributes
          }
        }),
        h(FastGridPagination, {
          slot: 'south',
          props: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            ..._omit(this.paginationAttributes, ['currentPage', 'pageSize', 'isShowPagination']),
            total: this.total,
            isShowPagination: this.isShowPagination
          }
        })
      ]
    )
  }
}
FastGrid.install = function (Vue) {
  // 用于按需加载的时候独立使用
  devConsole(FastGrid.name + '----install----')
  Vue.component(FastGrid.name, FastGrid)
}
export default FastGrid
