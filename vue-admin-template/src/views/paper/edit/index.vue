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
            <el-button type="info" class="fr" @click="getCollection"><svg-icon icon-class="store" /> 题库</el-button>
          </div>
          <question-editor v-if="showEditor" ref="questionEditor" :question-info="currentQuestion" />
        </el-main>
      </el-container>
      <!-- 编辑试卷题目 结束 -->
    </el-container>

    <!-- 返回顶部组件 开始 -->
    <back-to-top ref="backToTop" />
    <!-- 返回顶部组件 结束 -->

    <!-- 收藏列表 开始 -->
    <el-dialog
      :visible.sync="visble"
    >
      <span slot="title" style="color: #666; font-weight: 700;"><svg-icon icon-class="store" /> 收藏列表</span>
      <el-table :data="collections" style="width: 100%" max-height="400">
        <el-table-column label="标题" prop="title" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              ref="popover1"
              placement="top-start"
              title="试题"
              trigger="hover"
            >
              <div v-html="scope.row.content" />
              <span slot="reference" style="cursor: pointer">{{ scope.row.title }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分值" prop="score" align="center" show-overflow-tooltip />
        <el-table-column label="来源" prop="from" align="center" show-overflow-tooltip />
        <el-table-column fix="right" width="110">
          <template slot-scope="scope">
            <el-button type="primary" @click="useCollection(scope.row)"><svg-icon icon-class="use" /> 使用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 收藏列表 结束 -->
  </div>
</template>

<script>
import questionEditor from '@/components/questionEditor'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'EditPaper',
  components: {
    questionEditor,
    BackToTop
  },
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
      questionList: [],

      // 是否显示编辑区域
      showEditor: true,

      // 收藏的题目集合
      collections: [],

      // 是否显示收藏列表
      visble: false
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
        // 获取该试卷的试卷试题
        this.getPaperQuestions()
      }).catch(() => {
        this.$message.error('试卷信息获取失败，现在返回试卷列表，请稍后重试')
        this.$router.go(-1)
      })
    },
    // 根据试卷id获取该试卷的所有试题
    getPaperQuestions() {
      this.$store.dispatch('question/getPaperQuestions', { paperId: this.$route.params.id }).then(res => {
        // 将试题记录覆盖到当前试卷上
        this.coverRecord(res.data)
      })
    },
    // 选中试题列表中的某一项
    async selectMenuItem(e) {
      const arr = e.split('-')
      // 更改指定题目
      this.currentQuestionIndex = e
      this.currentQuestion.type = arr[0]
      this.currentQuestion.content = this.questions[arr[0]][arr[1]] || {}
      // 更改子组件的存储类型和存储格式
      this.$refs['questionEditor'].changeQuestionInfo(this.currentQuestion)
    },
    // 初始化试卷存储对象
    initQuestions(record) {
      this.questionTypes.filter(item => {
        return this.config[item.type]
      }).map(item => {
        this.questions[item.type] = []
      })
    },
    // 将之前编辑好的试题记录覆盖到当前试卷上
    coverRecord(record) {
      const keys = Object.keys(this.questions)
      keys.map(item => {
        if (record[item]) {
          for (const unit of record[item]) {
            this.questions[item][unit.orderNumber] = unit
          }
        }
      })
      // 赋予初始选项一到值的内容
      this.selectMenuItem(this.currentQuestionIndex)
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
      // 回到顶部
      // this.$refs['backToTop'].backToTop()
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
      // 回到顶部
      // this.$refs['backToTop'].backToTop()
    },
    // 保存当前编辑题目
    saveQuestion() {
      // 拆分当前索引，用于找寻存储空间
      const arr = this.currentQuestionIndex.split('-')
      const content = this.questions[arr[0]][arr[1]] || {}
      // 将返回的内容保存到对应的存储空间
      Object.assign(content, this.$refs['questionEditor'].getQuestionInfo())
      for (const item in content) {
        // 如果是字符串，去除前后空格
        if (typeof content[item] === 'string') {
          content[item].trim()
        }
      }
      content.orderNumber = +arr[1]
      content.paperId = this.$route.params.id
      this.questions[arr[0]][arr[1]] = content
      const data = { content, type: arr[0] }
      content.qid && (data.qid = content.qid)
      this.$store.dispatch('question/saveQuestion', data).then(res => {
        // 保存成功提醒
        this.$message.success('保存成功！')
        res.data && (this.questions[arr[0]][arr[1]].qid = res.data.qid)
      })
    },
    // 获取收藏的题目
    getCollection() {
      // 拆分当前索引，用于找寻存储空间
      const arr = this.currentQuestionIndex.split('-')
      // 参数
      const params = {
        state: this.$store.getters.constant.question.state.collection,
        type: arr[0]
      }
      // 发起请求
      this.$store.dispatch('question/getCollecQuestions', params).then(res => {
        this.collections = res.data
        this.visble = true
      })
    },
    // 使用仓库中的题目
    useCollection(row) {
      // 拆分当前索引，用于找寻存储空间
      const arr = this.currentQuestionIndex.split('-')
      // 获取对应的键
      const keys = Object.keys(this.questionContent[arr[0]])
      const content = {}
      keys.map(item => {
        content[item] = row[item]
      })
      this.questions[arr[0]][arr[1]] && this.questions[arr[0]][arr[1]].qid && (content.qid = this.questions[arr[0]][arr[1]].qid)
      this.questions[arr[0]][arr[1]] = content
      this.selectMenuItem(this.currentQuestionIndex)
      this.visble = false
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
