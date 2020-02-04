<template>
  <div class="edit-box">
    <div class="tc"><h2>{{ config.paperTitle }}</h2></div>
    <div class="tc"><span>试卷总分:{{ config.totalScore }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>考试时间:{{ config.time }}</span></div>
    <div class="mt10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ config.text }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 试卷配置
      config: {}
    }
  },
  created() {
    // 获取试卷信息
    this.getPaperDetail()
  },
  methods: {
    // 根据试卷id获取试卷详情
    getPaperDetail() {
      const params = {
        paperId: this.$route.params.id
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        console.log('获取的试卷信息：', res)
        this.config = res.data.config
      }).catch(() => {
        this.$message.error('试卷信息获取失败，现在返回试卷列表，请稍后重试')
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-box {
  padding: 20px;
}
.tc {
  text-align: center;
}
.mt10 {
  margin-top: 10px;
}
</style>
