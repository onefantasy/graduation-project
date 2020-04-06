<template>
  <div class="mark-box backgroundGray">
    <el-row :gutter="32">
      <el-col :span="16" class="paper">
        <el-scrollbar class="scrollbar-box">
          <!-- 试卷 开始 -->
          <!-- 遍历渲染试卷 开始 -->
          <div v-for="item in paper" :key="item.index">
            <h4>{{ item.index }}、{{ item.name }}</h4>
            <div v-for="(unit, index) in item.questions" :key="index">
              <div v-if="index !== 0">
                <!-- 试题序号与题目 开始 -->
                <div class="flex-box">
                  <span style="line-height: 50px;">{{ index }}、</span>
                  <div v-html="unit.content" />
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
                <p>标准答案：{{ unit.rightKey }}</p>
                <p>考生答案：
                  <span v-if="item.type !== 'essays'" :class="{ green: unit.isTrue !== null && unit.isTrue, red: unit.isTrue !== null && !unit.isTrue }">{{ unit.mineAnswer }}</span>
                  <span v-if="item.type === 'essays'" :class="{ green: unit.isTrue !== null && unit.isTrue, red: unit.isTrue !== null && !unit.isTrue }" v-html="unit.mineAnswer" />
                  <i v-if="!(unit.isTrue == null) && unit.isTrue" class="isTrue-tip green el-icon-check" />
                  <i v-if="!(unit.isTrue == null) && !unit.isTrue" class="isTrue-tip red el-icon-close" />
                </p>
                <p>分值：{{ unit.score }}</p>
                <div class="flex-box">
                  <div style="width: 60px;line-height: 40px;">得分: </div>
                  <el-input v-model="unit.newScore" type="number" style="width: 200px;" :min="0" :max="unit.score" />
                  <el-button type="primary" style="margin-left: 20px;" @click="changeScore(unit.oldScore, unit.newScore, unit, item.type, unit.score)">保存</el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- 遍历渲染试卷 结束 -->
          <!-- 试卷 结束 -->
        </el-scrollbar>
      </el-col>
      <el-col :span="8" style="position: relative;">
        <el-card class="fix-card">
          <h4 slot="header" style="margin: 0;">考生列表</h4>
          <el-scrollbar class="scrollbar-box-1">
            <el-menu
              :default-active="currentRecord"
            >
              <el-menu-item v-for="(item, index) in overall" :key="item.eid" :index="item.eid" @click="setAnswer(item.eid, item)">
                {{ index + 1 }}、{{ item.user.name }}
                <div class="fr">
                  {{ item.scoreExam }} 分
                </div>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 试卷配置
      config: {},

      // 试卷题目
      questions: {},

      // 题目类型
      questionTypes: [],

      // 获取中文序号
      chineseOrderNumber: [],

      // 需要渲染出来的试卷
      paper: [],

      // 选择题选项
      selectOptions: [],

      // 考试整体情况，在这个页面主要用于获取所有考生信息
      overall: '',

      // 考试总人数
      examNumber: 0,

      // 当前正在批改的考生试卷
      currentRecord: '1'
    }
  },
  created() {
    // 获取试卷题目的类型
    this.questionTypes = this.$store.getters.constant.question.types
    // 获取中文序号
    this.chineseOrderNumber = this.$store.getters.constant.chineseOrderNumber
    // 获取选择题选项
    this.selectOptions = this.$store.getters.constant.selectOptions
    // 获取试卷信息
    this.getPaperConfig()
  },
  methods: {
    // 获取试卷配置
    getPaperConfig() {
      // 参数
      const params = {
        paperId: this.$route.query.p
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        this.config = res.data.config
        // 获取该试卷的试卷试题
        this.getPaperQuestions()
      }).catch(() => {
        this.$message.error('试卷信息获取失败，请稍后重试')
        this.$router.go(-1)
      })
    },
    // 获取试卷题目
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
        this.initPaper()
        this.getExamineeList()
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
    },
    // 获取考生
    getExamineeList() {
      // 参数
      const params = {
        paperId: this.$route.query.p
      }
      // 发起请求
      this.$store.dispatch('exam/getExamOverallByPid', params).then(res => {
        this.overall = res.data
        this.examNumber = this.overall.length
        if (this.overall[0].eid) {
          // 默认显示第一位考生的数据
          this.currentRecord = this.overall[0].eid
          this.setAnswer(this.overall[0].eid, this.overall[0])
        }
      })
    },
    // 渲染考生答案到试卷上
    setAnswer(e, item) {
      this.currentRecord = e
      const answer = item.answerRecords
      for (let i = 0, len = this.paper.length; i < len; i++) {
        const questions = this.paper[i].questions
        for (let j = 0, l = questions.length; j < l; j++) {
          if (!questions[j]) {
            continue
          } else {
            for (let k = 0, long = answer.length; k < long; k++) {
              if (questions[j].qid === answer[k].qid) {
                this.$set(questions[j], 'isTrue', answer[k].isTrue)
                this.$set(questions[j], 'mineAnswer', answer[k].mineAnswer)
                this.$set(questions[j], 'oldScore', answer[k].isTrue == null ? '' : answer[k].score)
                this.$set(questions[j], 'newScore', questions[j].oldScore)
                break
              }
            }
          }
        }
      }
    },
    // 改变分数的函数
    changeScore(oldScore, newScore, unit, type, max) {
      newScore = +newScore
      oldScore = +oldScore
      if (newScore > max) {
        this.$message.warning('所给分值超过了本题的最大分值，无法保存！')
        return false
      }
      // +null 的值为零，此处使用隐式转换，不需要对空值做特殊处理
      const gap = newScore - oldScore
      unit.oldScore = newScore
      unit.isTrue = newScore !== 0
      let totalScore = -1
      for (let i = 0, l = this.overall.length; i < l; i++) {
        if (this.overall[i].eid === this.currentRecord) {
          this.overall[i].scoreExam += gap
          // 记录改变之后的分数
          totalScore = this.overall[i].scoreExam
          const answer = this.overall[i].answerRecords
          for (let j = 0, len = answer.length; j < len; j++) {
            if (answer[j].qid === unit.qid) {
              answer[j].score = newScore
              answer[j].isTrue = newScore !== 0
              break
            }
          }
          break
        }
      }
      if (totalScore === -1) {
        this.$message.warning('分数计算出错，无法进行保存！')
      } else {
        // 发起请求
        // 请求用的参数
        const params = {
          eid: this.currentRecord,
          qid: unit.qid,
          type,
          totalScore,
          newScore,
          gap
        }
        this.$store.dispatch('exam/changeScore', params).then(res => {
          this.$message.success('保存成功！')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.mark-box {
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>

<style lang="scss" scoped>
.mark-box {
  padding: 20px 20px 0;
  position: relative;

  .flex-box {
    display: flex;
  }

  .paper {
    background: #fff;
    padding-left: 20px !important;
    padding-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .scrollbar-box {
    height: calc(100vh - 125px);
  }

  .scrollbar-box-1 {
    height: calc(100vh - 200px);
  }

  .fr {
    float: right;
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
}
.backgroundGray {
  background-color: rgb(240, 242, 245);
}
</style>
