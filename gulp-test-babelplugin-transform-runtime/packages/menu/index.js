/**
 * @desc
 * menu 菜单按钮控件
 * 在其它控件右键菜单事件 'contextmenu'时，可以动态在点击的位置处显示menu控件
 * 比如：tree的右键 '刷新'节点
 * tip: 必须显示调用showAt(x,y)才能创建控件
 * @example
 * mounted(){
 *  let menu = new tjMenu()
 *  menu.add([{text: '增加',grade: 'info'},{text: '下载文档',grade: 'warning'}])
 *  //menu.add({text: '增加'})
 *  menu.showAt(200,300)
 * }
 * */
// @ts-ignore
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import _isNil from 'lodash/isNil'
import _find from 'lodash/find'

class FastMenu {
  /**
   *
   * @param {Array} menu - 菜单配置对象
   * @example
   * new FastMenu([{ text: '分析', listeners: { click: () => {} } }])
   */
  constructor (menu = []) {
    this.currentMenu = []
    this.menuId = 'fastMenu'
    this.handler = []
    this.events = {
      doBeforeClose: 'doBeforeClose' // 关闭之前
    }
    this.removeMenuNode()
    setTimeout(() => {
      this.createMenuNode(menu)
    }, 0);
  }
  /**
   * @desc 增加菜单项
   * @param {Array} menu - 菜单配置对象
   * @example
   * new FastMenu([{ text: '分析', listeners: { click: () => {} } }])
   */
  add (menu = []) {
    this.currentMenu = menu
  }
  /**
   * @desc 创建menu的展示节点
   */
  createMenuNode () {
    let b = document.createElement('div')
    b.setAttribute('id', this.menuId)
    b.setAttribute('style', 'position:absolute;top:0px;left:0px;z-index:100;')
    document.body.appendChild(b)
  }
  /**
   * @desc 移除节点
   */
  removeMenuNode () {
    if (!_isNil(document.getElementById(this.menuId))) {
      // 触发事件
      this.fire(this.events.doBeforeClose)
      document.body.removeChild(document.getElementById(this.menuId))
    }
  }
  /**
   * @dec 触发事件
   * @param {String} event - 事件名称
   */
  fire (event) {
    _find(this.handler, item => {
      (item['event'] === event) && item['handler']()
    })
  }
  /**
   * @desc 添加事件
   * @param {String} event - 事件名称
   * @param {Function} handler - 回调函数
   */
  on (event, handler) {
    this.handler.push({ event, handler })
  }
  /**
   * @desc 生成菜单
   * @param {Number} x - 菜单栏 div 生成的 x 轴坐标值
   * @param {Number} y - 菜单栏 div 生成的 y 轴坐标值
   */
  showAt (x, y) {
    setTimeout(() => {
      this.createMenu(x, y)
    }, 0)
  }
  // 创建菜单栏
  createMenu (x = 0, y = 0) {
    let _this = this
    let UserMenu = Vue.extend({
      data () {
        return {
          menuId: _this.menuId
        }
      },
      created () {
        _this.on(_this.events.doBeforeClose, () => {
          this.$destroy()
        })
      },
      methods: {
        createChildNode (h) {
          let lis = []
          _this.currentMenu.forEach((li, index) => {
            lis.push(h('li', {
              style: {
                'list-style': 'none',
                'padding-bottom': (_this.currentMenu.length - 1 === index) ? '0px' : '2px',
                'border-bottom': (_this.currentMenu.length - 1 === index) ? '0px' : '1px solid #F2F2F2'
              }
            },
            [h('fast-Button', {
              props: { width: '80px', grade: 'text', size: 'mini', ...li },
              on: {
                // 菜单按钮点击之后处理事件
                afterClickHandler: () => {
                  _this.removeMenuNode()
                  setTimeout(() => {
                    _this.createMenuNode([])
                  }, 0);
                }
              }
            })]
            )
            )
          });
          let ul = h('div',
            {
              style: {
                padding: '2px',
                border: '1px solid #F2F2F2'
              }
            }, lis)
          return [ul]
        }
      },
      render (h) {
        return h('div',
          {
            style: {
              position: 'absolute',
              top: `${y}px`,
              left: `${x}px`,
              'background-color': '#fff',
              'z-index': 100
            },
            attrs: {
              id: this.menuId
            }
          }, this.createChildNode(h))
      }
    })
    // 创建 userMenu 实例，并挂载到一个元素上。
    new UserMenu().$mount(`#${this.menuId}`)
  }
}
export default FastMenu
