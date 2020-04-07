export default {
  data() {
    return {
      // 遮罩
      load: null
    }
  },
  beforeMount() {},
  beforeDestroy() {},
  mounted() {},
  methods: {
    // 计算表格序号
    computedIndex(index) {
      return (this.page - 1) * this.pageSize + index + 1
    },
    // 格式化时间
    formatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 开启遮罩
    openLoad(target) {
      this.load = this.$loading({ target })
    },
    // 关闭遮罩
    closeLoad() {
      if (this.load) this.load.close()
    }
  }
}
