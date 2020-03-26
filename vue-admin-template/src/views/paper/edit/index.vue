<template>
  <div class="edit-box">
    <!-- 试卷标题 开始 -->
    <div class="tc"><h2>{{ config.paperTitle }}</h2></div>
    <div class="tc"><span>试卷总分:{{ config.totalScore }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>考试时间:{{ config.time }}</span></div>
    <div class="mt10 mb10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ config.text }}</div>
    <!-- 试卷标题 结束 -->

    <el-container>
      <!-- 题目侧边栏 开始 -->
      <el-aside width="200px">
        <el-scrollbar style="height: 100%;">
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
            <el-button :disabled="questionsIndex.indexOf(currentQuestionIndex) === questionsIndex.length - 1" class="fr" @click="nextQuestion">下一题 <i class="el-icon-arrow-right" /> </el-button>
            <el-button icon="el-icon-finished" type="primary" class="fr" @click="saveQuestion">保存</el-button>
          </div>
          <question-editor ref="questionEditor" :question-info="currentQuestion" />
        </el-main>
      </el-container>
      <!-- 编辑试卷题目 结束 -->
    </el-container>
  </div>
</template>

<script>
import questionEditor from '@/components/questionEditor'
export default {
  components: {
    questionEditor
  },
  name: 'edit',
  data() {
    return {
      // 试卷配置
      config: {},

      // 大写中文序号
      chineseOrderNumber: [],

      // 题型与对应的标志
      questionTypes: [],

      // 题目的数据内容
      questionContent: {},

      // 存储试卷试题的对象
      questions: {},

      // 当前正在编辑的试题
      currentQuestion: {},

      // 试题索引合集
      questionsIndex: [],

      // 当前编辑试题的索引
      currentQuestionIndex: '',

      // 试题列表
      questionList: []
    }
  },
  created() {
    // 获取中文序号
    this.chineseOrderNumber = this.$store.getters.constant.chineseOrderNumber
    // 获取题型与其对应标志
    this.questionTypes = this.$store.getters.constant.question.types
    // 获取每种题型的存储格式
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
        this.config = res.data.config
        // 初始化存储试卷试题的对象
        this.initQuestions()
        // 初始化试题列表
        this.initQuestionList()
      }).catch(() => {
        this.$message.error('试卷信息获取失败，现在返回试卷列表，请稍后重试')
        this.$router.go(-1)
      })
    },
    // 选中试题列表中的某一项
    async selectMenuItem(e) {
      // 同样路径不进行任何操作
      if (e === this.currentQuestionIndex) return true
      // 判断当前内容是否需要保存
      let flag = this.$refs['questionEditor'].isNeedSave()
      // 保存提示
      flag && await this.$confirm('编辑的内容尚未保存，确定要离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flag = false
      }).catch(() => {
        flag = true
      })
      if (flag) {
        const old = this.currentQuestionIndex
        this.currentQuestionIndex = e
        // 直接改变没有效果，所以使用定时器延迟修改
        // 定时器设定当前编辑的试题的索引
        setTimeout(() => {
          this.currentQuestionIndex = old
        }, 100)
        return false
      }
      const arr = e.split('-')
      // 更改指定题目
      this.currentQuestionIndex = e
      this.currentQuestion.type = arr[0]
      this.currentQuestion.content = this.questions[arr[0]][arr[1]] || {}
      // 更改子组件的存储类型和存储格式
      this.$refs['questionEditor'].changeQuestionInfo(this.currentQuestion)
    },
    // 初始化试卷存储对象
    initQuestions() {
      this.questionTypes.filter(item => {
        return this.config[item.type]
      }).map(item => {
        this.questions[item.type] = []
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
    // 保存当前编辑题目
    saveQuestion() {
      // 拆分当前索引，用于找寻存储空间
      const arr = this.currentQuestionIndex.split('-')
      // 将返回的内容保存到对应的存储空间
      this.questions[arr[0]][arr[1]] = Object.assign({}, this.$refs['questionEditor'].getQuestionInfo())
      // 保存成功提醒
      this.$message.success('保存成功！')
    }
  }
}
</script>

<style lang="scss">
.edit-box {
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

  .mb10 {
    margin-bottom: 10px;
  }

  .fr {
    float: right;
  }
}
</style>
