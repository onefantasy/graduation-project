<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
    this.isFullscreen = screenfull.isFullscreen
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
    //   if (!screenfull.enabled) {
    //     this.$message({
    //       message: 'you browser can not work',
    //       type: 'warning'
    //     })
    //     return false
    //   }
      screenfull.toggle()
    },
    // 全屏状态发生变化
    change() {
      this.isFullscreen = screenfull.isFullscreen
      if (!this.isFullscreen) {
        // 通知父组件，关闭了全屏
        this.$emit('closeFull')
      }
    },
    init() {
      if (!screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (!screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
