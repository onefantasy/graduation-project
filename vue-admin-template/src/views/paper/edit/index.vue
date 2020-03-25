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
          <el-menu style="border: 0;" @select="selectMenuItem">
            <el-submenu v-for="item of questionList" :key="item.index" :index="item.index">
              <template slot="title"><i class="el-icon-document" />{{ `${ item.index }、${ item.name }(${ config[item.type + 'Score'] }分)` }}</template>
              <el-menu-item v-for="unit of item.number" :key="unit" :index="`${ item.type }-${ unit }`">题目{{ unit }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 题目侧边栏 结束 -->

      <!-- 编辑试卷题目 开始 -->
      <el-container>
        <el-main>
          <question-editor />
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
      questions: {}
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
      }).catch(() => {
        this.$message.error('试卷信息获取失败，现在返回试卷列表，请稍后重试')
        this.$router.go(-1)
      })
    },
    // 选中菜单
    selectMenuItem(e) {
      const arr = e.split('-')
      this.questions[arr[0]][arr[1]]
    },
    // 初始化试卷存储对象
    initQuestions() {
      this.questionTypes.filter(item => {
        return this.config[item.type]
      }).map(item => {
        this.questions[item.type] = []
      })
    }
  }
}
</script>

<style lang="scss">
.edit-box {
  .el-scrollbar__wrap{
    overflow-x: hidden;
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
}
</style>
