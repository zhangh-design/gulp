/**
 * detail 面板
 */
const FastGridDetail = {
  name: 'FastGridDetail',
  inject: ['getFastGrid'],
  render (h) {
    return h(
      'div',
      {
        style: 'height: 100%;'
      },
      ['detail 面板']
    )
  }
}
export default FastGridDetail
