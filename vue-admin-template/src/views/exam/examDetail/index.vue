<template>
  <div class="examDetail-box">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div slot="header">
            <span>考生: {{ userInfo.name }}</span>
          </div>
          <h4>试卷得分：{{ record.target.scoreExam }}</h4>
          <h4>单选得分：{{ record.target.singlesExam }}</h4>
          <h4>多选得分：{{ record.target.multiplesExam }}</h4>
          <h4>判断得分：{{ record.target.judgesExam }}</h4>
          <h4>填空得分：{{ record.target.completionsExam }}</h4>
          <h4>问答得分：{{ record.target.essaysExam }}</h4>
          <h4>整体排名：{{ record.orderNumber }} / {{ record.recordNumber }}</h4>
        </el-card>
      </el-col>
      <el-col :span="18">
        试卷信息
      </el-col>
    </el-row>
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
      questions: {},

      // 用户信息
      userInfo: '',

      // 考试记录
      record: ''
    }
  },
  created() {
    // 获取用户信息
    this.userInfo = this.$store.getters.userInfo

    // 请求试卷信息
    this.getPaperDetail()
    // 请求本次考试的记录
    this.getExamRecord()
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
    },
    // 获取本次考试的记录
    getExamRecord() {
      console.log('获取记录')
      // 参数
      const params = {
        eid: this.$route.query.e,
        paperId: this.$route.query.p
      }
      // 发起请求
      this.$store.dispatch('exam/getExamRecordByAP', params).then(res => {
        this.record = res.data
        console.log('请求返回结果：', res)
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
