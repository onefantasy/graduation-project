<template>
  <div class="edit-box">
    <div class="tc"><h2>{{ config.paperTitle }}</h2></div>
    <div class="tc"><span>试卷总分:{{ config.totalScore }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>考试时间:{{ config.time }}</span></div>
    <div class="mt10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ config.text }}</div>

    <!-- 题目部分 开始 -->
    <div v-for="item of questionList" :key="item.index">
      <!-- 题型标题 -->
      <h2>{{ `${item.index}、${item.name}(${config[item.type + 'Score']}分)` }}</h2>
      <!-- 题目 开始 -->
      <div v-for="unit of item.number" :key="unit">
        <div class="flex-box question-item">
          <strong>{{ unit }}、</strong>
          <el-input v-model="questions[item.type]" type="number" :min="0" placeholder="请输入分值" class="score-input" @chang="changScore" />
        </div>
      </div>
      <!-- 题目 结束 -->
    </div>
    <!-- 题目部分 结束  -->
  </div>
</template>

<script>
// import editor from '@/components/editor'
export default {
  components: {
    // editor
  },
  data() {
    return {
      // 试卷配置
      config: {},

      // 大写中文序号
      chineseOrderNumber: [],

      // 题型与对应的标志
      questionTypes: [],

      // 存储题目的对象
      questions: {},

      // 题目的数据内容
      questionContent: {}
    }
  },
  computed: {
    // 渲染的题目
    questionList() {
      let index = 0
      return this.questionTypes.filter(item => {
        return this.config[item.type]
      }).map(item => {
        const unit = {
          index: this.chineseOrderNumber[index],
          name: item.name,
          type: item.type,
          number: this.config[item.type]
        }
        index++
        return unit
      })
    }
  },
  created() {
    // 获取中文序号
    this.chineseOrderNumber = this.$store.getters.constant.chineseOrderNumber
    // 获取题型与其对应标志
    this.questionTypes = this.$store.getters.constant.question.types
    // 获取每种题型的存储内容
    this.questionContent = JSON.parse(JSON.stringify(this.$store.getters.constant.question.content))

    // 获取试卷信息
    this.getPaperDetail()
  },
  methods: {
    // 根据试卷id获取试卷详情
    getPaperDetail() {
      // 参数
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
    },
    // 初始化题目的对象
    initQuestions() {

    },
    // 更改分数时的回调
    changScore() {
      console.log('题目合集：', this.questions)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-box {
  padding: 20px;

  .flex-box {
    display: flex;
    line-height: 40px;

    .score-input {
      width: 200px;
    }
  }

  .tc {
    text-align: center;
  }
  .mt10 {
    margin-top: 10px;
  }

  .question-item {
    margin: 10px 0;
  }
}
</style>
