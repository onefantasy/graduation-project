<template>
  <!-- <el-scrollbar class="app-main-scrollbar"> -->
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
  <!-- </el-scrollbar> -->
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 84px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
// .app-main-scrollbar {
//   position: absolute;;
//   top: 84px;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   >.el-scrollbar__wrap{
//     overflow-x: hidden;
//   }
// }
</style>
