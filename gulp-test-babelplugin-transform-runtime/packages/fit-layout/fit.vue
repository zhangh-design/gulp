<template>
  <el-container class="fit-layout-container">
    <el-main :style="{padding}">
      <slot name="default" />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'FastFitLayout',
  props: {
    padding: {
      type: String,
      default: '0px 20px'
    }
  },
  data () {
    this.desc = 'fit 布局，一个子元素将填充满整个容器（只接受一个子元素）'
    return {

    }
  }
}
</script>
