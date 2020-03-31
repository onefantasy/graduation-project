<template>
  <div class="examDetail-box">
    考试记录详情页面
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      // 试卷配置
      cocnfig: {},

      // 问题合集
      questions: {}
    }
  },
  created() {
    // 请求试卷信息
    this.getPaperDetail()
  },
  methods: {
    // 获取试卷信息
    getPaperDetail() {
      // 参数
      const params = {
        paperId: this.$route.query.p
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        // 获取试卷配置
        this.config = res.data.config
        console.log('试卷配置：', this.config)
        // 获取该试卷的试卷试题
        this.getPaperQuestions()
      }).catch(() => {
        this.$message.error('试卷信息获取失败，请稍后重试')
        this.$router.go(-1)
      })
    },
    // 获取该试卷试题
    getPaperQuestions() {
      const paperId = this.$route.query.p
      this.$store.dispatch('question/getPaperQuestions', { paperId }).then(res => {
        const data = res.data
        // 将请求到试题生成试卷
        for (const key in data) {
          data[key].map(item => {
            // 试题
            this.questions[key] || (this.questions[key] = [])
            this.questions[key][item.orderNumber] = item
          })
        }
        console.log('试卷题目：', this.questions)
        // 初始化试题列表
        // this.initQuestionList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.examDetail-box {
  padding: 20px;
}
</style>
