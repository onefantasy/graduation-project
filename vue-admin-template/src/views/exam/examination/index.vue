<template>
  <div ref="examination" class="examination-box">
    <!-- 全屏组件，用于开启全屏和关闭全屏功能 开始 -->
    <div v-show="false">
      <screenfull id="screenfull" ref="screenfull" class="right-menu-item hover-effect" />
    </div>
    <!-- 全屏组件，用于开启全屏和关闭全屏功能 结束 -->

    <!-- 试卷标题 开始 -->
    <div>
      <div class="tc"><h2>{{ config.paperTitle }}</h2></div>
      <div class="tc"><span>试卷总分:{{ config.totalScore }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>考试时间:{{ config.time }}</span></div>
      <div class="mt10 mb10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ config.text }}</div>
    </div>
    <!-- 试卷标题 结束 -->

    <el-container>
      <!-- 题目侧边栏 开始 -->
      <el-aside width="200px">
        <el-scrollbar style="height: 500px">
          <el-menu style="border: 0;" :default-active="currentQuestionIndex" :unique-opened="true" @select="selectMenuItem">
            <el-submenu v-for="item of questionList" :key="item.index" :index="item.index">
              <template slot="title"><i class="el-icon-s-promotion" />{{ `${ item.index }、${ item.name }(${ config[item.type + 'Score'] }分)` }}</template>
              <el-menu-item v-for="unit of item.number" :key="unit" :index="`${ item.type }-${ unit }`">题目{{ unit }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 题目侧边栏 结束 -->

      <!-- 编辑试卷题目 开始 -->
      <el-container>
        <el-main>
          <div style="padding: 0 20px 0 100px;">
            <el-button icon="el-icon-arrow-left" :disabled="questionsIndex.indexOf(currentQuestionIndex) === 0" @click="preQuestion">上一题</el-button>
            <timer v-if="config.time" ref="timer" class="timer" :time="config.time" @timeout="submitPaper(true)" />
            <el-button :disabled="questionsIndex.indexOf(currentQuestionIndex) === questionsIndex.length - 1" class="fr" @click="nextQuestion">下一题 <i class="el-icon-arrow-right" /> </el-button>
            <el-button icon="el-icon-finished" type="primary" class="fr" style="margin-right: 10px;" @click="submitPaper(false)">交卷</el-button>
          </div>
          <div style="padding: 0 20px 0 100px;">
            <question
              v-if="questions[currentType]"
              :issue="questions[currentType][currentIndex]"
              :type="currentType"
              :index="+currentIndex"
              :answers="answers"
            />
          </div>
        </el-main>
      </el-container>
      <!-- 编辑试卷题目 结束 -->
    </el-container>
  </div>
</template>

<script>
import { grading } from '@/utils/grade'
import screenfull from '@/components/Screenfull'
import question from '../children/question'
import timer from '../children/timer'
export default {
  components: {
    screenfull,
    question,
    timer
  },
  data() {
    return {
      // 试卷配置
      config: {},

      // 大写中文序号
      chineseOrderNumber: [],

      // 题型与对应的标志
      questionTypes: [],

      // 试题索引合集
      questionsIndex: [],

      // 当前考试的试题的索引
      currentQuestionIndex: '',

      // 试题列表
      questionList: [],

      // 考试作答内容的存储格式
      answer: {},

      // 当前正在作答的试题类型
      currentType: '',

      // 当前正在作答的试题的索引
      currentIndex: 1,

      // 该试卷所有试题的合集
      questions: {},

      // 考试作答记录
      answers: {},

      // 考试者
      account: '',

      // 加载遮罩
      load: null
    }
  },
  created() {
    // 获取中文序号
    this.chineseOrderNumber = this.$store.getters.constant.chineseOrderNumber
    // 获取题型与其对应标志
    this.questionTypes = this.$store.getters.constant.question.types
    // 获取考试回答内容的存储格式
    this.answer = this.$store.getters.constant.answer

    // 当前用户信息
    this.account = this.$store.getters.userInfo.account

    // 开启加载遮罩
    this.openLoad()
    // 获取试卷信息
    this.getPaperDetail()
  },
  mounted() {
    // if (!this.$refs['screenfull'].isFullscreen) {
    //   // 如果不是全屏，则开启全屏模式
    //   this.$refs['screenfull'].click()
    // }
  },
  methods: {
    // 开启遮罩
    openLoad() {
      this.load = this.$loading({ target: this.$refs['examination'] })
    },
    // 关闭遮罩
    closeLoad() {
      if (this.load) this.load.close()
    },
    // 根据试卷id获取试卷详情
    getPaperDetail() {
      // 参数
      const params = {
        paperId: this.$route.query.paperId
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        this.config = res.data.config
        // 获取该试卷的试卷试题
        this.getPaperQuestions()
      }).catch(() => {
        this.$message.error('试卷信息获取失败，请稍后重试')
        this.$router.go(-1)
        this.closeLoad()
      })
    },
    // 根据试卷id获取该试卷的所有试题
    getPaperQuestions() {
      const paperId = this.$route.query.paperId
      const eid = this.$route.query.e
      this.$store.dispatch('question/getPaperQuestions', { paperId, type: 'exam' }).then(res => {
        const data = res.data
        // 将请求到试题生成试卷
        for (const key in data) {
          data[key].map(item => {
            // 作答记录格式
            this.answers[key] || (this.answers[key] = [])
            this.answers[key][item.orderNumber] = {
              paperId,
              qid: item.qid,
              account: this.account,
              mineAnswer: '',
              isTrue: '',
              score: 0,
              questionType: key,
              eid
            }
            // 试题
            this.questions[key] || (this.questions[key] = [])
            this.questions[key][item.orderNumber] = item
          })
        }
        // 初始化试题列表
        this.initQuestionList()
      }).finally(() => {
        this.closeLoad()
      })
    },
    // 初始化试题列表
    initQuestionList() {
      // 初始化试题索引合集
      this.questionsIndex = []
      let index = 0
      this.questionList = this.questionTypes.filter(item => {
        return this.config[item.type]
      }).map(item => {
        const unit = {
          index: this.chineseOrderNumber[index],
          name: item.name,
          type: item.type,
          number: this.config[item.type]
        }
        // 生成试题索引合集
        for (let i = 1; i <= unit.number; i++) {
          this.questionsIndex.push(`${unit.type}-${i}`)
        }
        index++
        return unit
      })
      // 初始化选中的题目
      this.selectMenuItem(this.questionsIndex[0])
    },
    // 选中试题列表中的某一项
    async selectMenuItem(e) {
      const arr = e.split('-')
      this.currentType = arr[0]
      this.currentIndex = arr[1]
      // 更改指定题目
      this.currentQuestionIndex = e
    },
    // 上一题
    preQuestion() {
      const index = this.questionsIndex.indexOf(this.currentQuestionIndex) - 1
      // 索引出错处理
      if (index < 0) {
        this.$message.error('索引出错，请刷新页面重试！')
        return false
      }
      // 题目跳转
      this.selectMenuItem(this.questionsIndex[index])
    },
    // 下一题
    nextQuestion() {
      const index = this.questionsIndex.indexOf(this.currentQuestionIndex) + 1
      // 索引出错处理
      if (index >= this.questionsIndex.length) {
        this.$message.error('索引出错，请刷新页面重试！')
        return false
      }
      // 题目跳转
      this.selectMenuItem(this.questionsIndex[index])
    },
    // 交卷
    async submitPaper(bool) {
      let flag = false
      if (!bool) {
        // bool 为true时，表示超时交卷,不需要提醒
        await this.$confirm('确定要交卷吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flag = false
        }).catch(() => {
          flag = true
        })
      }
      if (flag) return false

      // 记录评分结果
      let data = null

      // 获取这张试卷的所有正确答案
      this.$store.dispatch('question/getPaperQuestions', { paperId: this.$route.query.paperId }).then(res => {
        // 调用评分函数
        data = grading(res.data, this.answers)
        data.score.eid = this.$route.query.e
        data.score.endExam = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        data.score.timeExam = this.$refs['timer'].getUsedTime()
        return this.$store.dispatch('exam/endExam', data.score)
      }).then(res => {
        this.$store.dispatch('answer/saveAnswerRecords', { records: data.answerArr })
      }).then(res => {
        // 删除当前页面的affix
        this.$store.commit('tagsView/DEL_VISITED_VIEW', this.$route)
        this.$message.success('交卷成功！')
        // 进行路由跳转
        this.$router.push('/dashboard')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.examination-box {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-menu-item.is-active,
  .el-menu-item:hover,
  .el-menu-item:active,
  .el-menu-item:focus {
    background: rgba(64, 158, 255, .2);
    border: 1px solid rgb(64,158,255);
    border-radius: 20px;
  }
}
</style>

<style lang="scss" scoped>
.examination-box {
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

  .mb10 {
    margin-bottom: 10px;
  }

  .fr {
    float: right;
  }

  // 计时器与交卷按钮
  .timer {
    display: inline-block;
  }
}
</style>
