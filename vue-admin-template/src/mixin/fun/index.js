export default {
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
    }
  }
}
