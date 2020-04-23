<template>
  <div class="examDetail-box">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card v-if="record">
          <div slot="header">
            <h3>考生: {{ userInfo.name }}</h3>
          </div>
          <el-image :src="userInfo.headIcon || defaultHeadIcon" :preview-src-list="[userInfo.headIcon || defaultHeadIcon]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <p>学校：{{ userInfo.school }}</p>
          <p>专业：{{ userInfo.major }}</p>
          <p>班级：{{ userInfo.class }}</p>
          <p>学号：{{ userInfo.number }}</p>
          <h4>试卷得分：{{ showScore(record.target.scoreExam) }} / {{ config.totalScore }}</h4>
          <h4>单选得分：{{ showScore(record.target.singlesExam) }} / {{ config.singlesScore }}</h4>
          <h4>多选得分：{{ showScore(record.target.multiplesExam) }} / {{ config.multiplesScore }}</h4>
          <h4>判断得分：{{ showScore(record.target.judgesExam) }} / {{ config.judgesScore }}</h4>
          <h4>填空得分：{{ showScore(record.target.completionsExam) }} / {{ config.completionsScore }}</h4>
          <h4>问答得分：{{ showScore(record.target.essaysExam) }} / {{ config.essaysScore }}</h4>
          <h4>整体排名：{{ record.orderNumber }} / {{ record.recordNumber }}</h4>
          <h4>考试用时：{{ record.target.timeExam }}</h4>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header">
            <h3>{{ config.paperTitle }}</h3>
          </div>
          <!-- 遍历渲染试卷 开始 -->
          <div v-for="item in paper" :key="item.index">
            <h4>{{ item.index }}、{{ item.name }}</h4>
            <div v-for="(unit, index) in item.questions" :key="index">
              <div v-if="index !== 0">
                <!-- 试题序号与题目 开始 -->
                <div class="flex-box">
                  <span style="line-height: 50px;">{{ index }}、</span>
                  <el-tooltip effect="dark" content="点击收藏该题" placement="top-start">
                    <div class="issues" @click="collectQuestion(unit, item, config)" v-html="unit.content" />
                  </el-tooltip>
                </div>
                <!-- 试题序号与题目 结束 -->
                <!-- 选项 开始 -->
                <div v-if="unit[selectOptions[0]]">
                  <div v-for="option in selectOptions" :key="option">
                    <div v-if="unit[option]" class="flex-box">
                      <span style="line-height: 50px;">{{ option }}、</span>
                      <span v-html="unit[option]" />
                    </div>
                  </div>
                </div>
                <!-- 选项 结束 -->
                <p>
                  分值：{{ unit.score }}
                </p>
                <!-- <p>参考答案：{{ unit.rightKey }}</p> -->
                <p>参考答案：<span v-html="unit.rightKey" /></p>
                <p>我的答案：
                  <span v-if="item.type !== 'essays'" :class="{ green: unit.isTrue !== null && unit.isTrue, red: unit.isTrue !== null && !unit.isTrue }">{{ unit.mineAnswer }}</span>
                  <span v-if="item.type === 'essays'" :class="{ green: unit.isTrue !== null && unit.isTrue, red: unit.isTrue !== null && !unit.isTrue }" v-html="unit.mineAnswer" />
                  <i v-if="!(unit.isTrue == null) && unit.isTrue" class="isTrue-tip green el-icon-check" />
                  <i v-if="!(unit.isTrue == null) && !unit.isTrue" class="isTrue-tip red el-icon-close" />
                </p>

              </div>
            </div>
          </div>
          <!-- 遍历渲染试卷 结束 -->
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :visible="visable"
      title="收藏试题"
      :show-close="false"
      @closed="closeDialog"
    >
      <MDinput v-model="collectionTitle" class="paperId-input">
        <span>标题</span>
      </MDinput>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visable = false"><i class="el-icon-close" /> 取 消</el-button>
        <el-button type="primary" @click="submitCollection"><i class="el-icon-circle-plus-outline" /> 收 藏</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
export default {
  components: {
    MDinput
  },
  data() {
    return {
      // 试卷配置
      config: {},

      // 问题合集
      questions: {},

      // 用户信息
      userInfo: '',

      // 考试记录
      record: '',

      // 选择题选项
      selectOptions: [],

      // 获取试题类型
      questionTypes: [],

      // 中文序号
      chineseOrderNumber: [],

      // 答题记录
      answersRecords: [],

      // 需要渲染的试卷数据
      paper: [],

      // 收藏的标志
      collection: '',

      // 收藏弹窗的显示与隐藏
      visable: false,

      // 收藏试题的title
      collectionTitle: '',

      // 收藏题目的数据
      collectionIssue: {}
    }
  },
  created() {
    // 获取用户信息
    this.userInfo = this.$store.getters.userInfo
    // 获取选择题选项
    this.selectOptions = this.$store.getters.constant.selectOptions
    // 获取试题类型
    this.questionTypes = this.$store.getters.constant.question.types
    // 获取中文序号
    this.chineseOrderNumber = this.$store.getters.constant.chineseOrderNumber
    // 从仓库获取收藏的标志
    this.collection = this.$store.getters.constant.question.state.collection

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
        // // 获取该试卷的试卷试题
        // this.getPaperQuestions()
        // 根据eid获取答题记录
        this.getAnswersByEid()
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
            // 将作答的数据记录下来
            for (let i = 0, l = this.answersRecords.length; i < l; i++) {
              if (item.qid === this.answersRecords[i].qid) {
                item.mineAnswer = this.answersRecords[i].mineAnswer
                item.isTrue = this.answersRecords[i].isTrue
              }
            }
            // 试题
            this.questions[key] || (this.questions[key] = [])
            this.questions[key][item.orderNumber] = item
          })
        }
        // 初始化试题列表
        this.initPaper()
      })
    },
    // 根据eid获取答题记录
    getAnswersByEid() {
      // 参数
      const params = { eid: this.$route.query.e }
      // 发起请求
      this.$store.dispatch('answer/getAnswersByEid', params).then(res => {
        // console.log('根据eid获取到的记录:', res)
        this.answersRecords = res.data
        // 获取该试卷的试卷试题
        this.getPaperQuestions()
      })
    },
    // 初始化试卷
    initPaper() {
      let index = 0
      this.paper = this.questionTypes.filter((item, index) => {
        return this.config[item.type]
      }).map(item => {
        const obj = {
          index: this.chineseOrderNumber[index],
          name: item.name,
          type: item.type,
          questions: this.questions[item.type]
        }
        index++
        return obj
      })
      // console.log('需要渲染的试卷：', this.paper)
    },
    // 获取本次考试的记录
    getExamRecord() {
      // 参数
      const params = {
        eid: this.$route.query.e,
        paperId: this.$route.query.p
      }
      // 发起请求
      this.$store.dispatch('exam/getExamRecordByAP', params).then(res => {
        this.record = res.data
      })
    },
    // 处理需要显示的分数
    showScore(score) {
      if (score !== 0 && !score) {
        return '尚未批改'
      }
      return score
    },
    // 收藏题目
    collectQuestion(unit, item, config) {
      const question = {}
      question.content = Object.assign({}, unit)
      delete question.content.qid
      delete question.content.createdAt
      delete question.content.paperId
      question.content.state = this.collection
      question.type = item.type
      question.content.from = config.paperTitle
      question.content.auth = config.user.name
      this.collectionIssue = question
      this.visable = true
    },
    // 提交收藏的题目
    submitCollection() {
      if (!this.collectionTitle) {
        this.$message.warning('请填写改题目标题，用于区分其他收藏的题目！')
        return false
      }
      this.collectionIssue.content.title = this.collectionTitle
      this.visable = false
      // 发起请求
      this.$store.dispatch('question/saveQuestion', this.collectionIssue).then(res => {
        this.$message.success('收藏成功！')
        this.visable = false
      })
    },
    // 关闭收藏弹窗的回调
    closeDialog() {
      this.collectionTitle = ''
      this.collectionIssue = {}
    }
  }
}
</script>

<style lang="scss">
.examDetail-box {
  .issues {
    img {
      width: 100%;
    }
  }
}
</style>

<style lang="scss" scoped>
.examDetail-box {
  padding: 20px;

  .flex-box {
    display: flex;
  }

  .green {
    color: green;
  }

  .red {
    color: red;
  }

  .isTrue-tip {
    font-weight: 700;
  }

  .issues {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
