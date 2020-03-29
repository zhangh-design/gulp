/**
 * search 面板
 */
const FastGridSearch = {
  name: 'FastGridSearch',
  inject: ['getFastGrid'],
  render (h) {
    return h(
      'div',
      {
        style: 'height: 100%;'
      },
      [this.$slots.default, this.$scopedSlots.searchScope()]
    )
  }
}
export default FastGridSearch
