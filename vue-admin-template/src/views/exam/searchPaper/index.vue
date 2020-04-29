<template>
  <div ref="searchPaperBox" class="searchPaper-box">
    <!-- 试卷编号搜索框 开始 -->
    <MDinput v-model="paperId" class="paperId-input">
      <span>试卷编号</span>
      <span slot="append" class="search-button"><i class="el-icon-search" @click="searchPaper" /></span>
    </MDinput>
    <!-- 试卷编号搜索框 结束 -->

    <!-- 试卷信息 开始 -->
    <el-card v-if="paperInfo.paperId" class="paperInfo-box">
      <div slot="header" class="clearfix">
        <span style="line-height: 40px">搜索结果</span>
        <el-button style="float: right" @click="goExam">开始考试</el-button>
      </div>
      <el-collapse v-model="activeName">
        <el-collapse-item name="1">
          <template slot="title">
            <i class="title-icon el-icon-info" />&nbsp;&nbsp;试卷信息
          </template>
          <h2>{{ paperInfo.paperTitle }}</h2>
          <h4>科目：{{ paperInfo.subject }}</h4>
          <h4>总分：{{ paperInfo.totalScore }}分</h4>
          <h4 v-for="item in typeArray" :key="item.name">{{ item.name }}: {{ item.number }}题&nbsp;&nbsp;&nbsp;&nbsp;共{{ item.score }}分</h4>
          <h3>{{ paperInfo.text }}</h3>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <i class="title-icon el-icon-user-solid" />&nbsp;&nbsp;发布者
          </template>
          <el-image
            style="width: 300px; float: left;"
            :src="paperInfo.user.headIcon || defaultHeadIcon"
            fit="contain"
            :preview-src-list="[paperInfo.user.headIcon || defaultHeadIcon]"
          />
          <div class="publisher-info">
            <h4>发布者：{{ paperInfo.user.name }}</h4>
            <h4>学校：{{ paperInfo.user.school }}</h4>
            <h4>专业：{{ paperInfo.user.major }}</h4>
            <h4>班级：{{ paperInfo.user.class }}</h4>
          </div>
        </el-collapse-item>
        <el-collapse-item title="考试时间" name="3">
          <template slot="title">
            <i class="title-icon el-icon-timer" />&nbsp;&nbsp;考试时间
          </template>
          <h4>考试时长：{{ paperInfo.time }}</h4>
          <h4>开始时间：{{ formatTime(paperInfo.startTime) }}</h4>
          <h4>截止时间：{{ formatTime(paperInfo.endTime) }}</h4>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!-- 试卷信息 结束 -->
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
// 导入混入文件
import fun from '@/mixin/fun'
export default {
  components: {
    MDinput
  },
  mixins: [fun],
  data() {
    return {
      // 用于查询的试卷编号
      paperId: 'p1585060038319',

      // 搜索获得的试卷信息
      paperInfo: {},

      // 当前展开到试卷信息
      activeName: ['0'],

      // 默认头像
      defaultHeadIcon: '',

      // 题型的合集
      questionTypes: [],

      // 用于渲染题型到数组
      typeArray: []
    }
  },
  created() {
    // 获取默认头像
    this.defaultHeadIcon = this.$store.getters.constant.defaultHeadIcon
    // 从仓库获取题的合集
    this.questionTypes = this.$store.getters.constant.question.types
  },
  methods: {
    // 搜索试卷
    searchPaper() {
      if (!this.paperId) {
        this.$message.warning('请先输入试卷编号！')
        return false
      }
      const loading = this.$loading({ target: this.$refs['searchPaperBox'] })
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', { paperId: this.paperId, publish: true }).then(res => {
        this.paperInfo = res.data.config
        // 计算用于渲染题型的数组
        this.computeTypeArray()
        setTimeout(() => { this.activeName = ['1'] }, 100)
      }).catch(() => {
        // this.$message.error('此试卷不存在或者尚未发布！')
      }).finally(() => {
        loading.close()
      })
    },
    // 计算用于渲染题型的数组
    computeTypeArray() {
      this.typeArray = this.questionTypes.filter(item => {
        return +this.paperInfo[item.type]
      }).map(item => {
        return {
          name: item.name,
          number: this.paperInfo[item.type],
          score: this.paperInfo[item.type + 'Score']
        }
      })
    },
    // 跳转到考试页面
    goExam() {
      this.$confirm('考试前，请确保网络的通畅以及充足的时间，一旦开始考试，便无法中断，是否要进行考试？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      //   const data = {
      //     paperId: this.paperInfo.paperId,
      //     account: this.$store.getters.userInfo.account,
      //     startExam: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      //     paperTitle: this.paperInfo.paperTitle,
      //     subject: this.paperInfo.subject
      //   }
      //   return this.$store.dispatch('exam/startExam', data)
      // }).then(res => {
      //   this.$store.commit('user/SET_TOKEN', res.token)
      //   this.$router.push(`/exam/examination?paperId=${this.paperInfo.paperId}&e=${res.data.eid}`)
        // 测试用的eid e1585548598871
        this.$router.push(`/exam/examination?paperId=${this.paperInfo.paperId}&e=e1587628114562`)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.searchPaper-box {
  padding: 20px;

  .paperId-input {
    width: 60%;
    margin-left: auto;
    margin-right: auto;

    .search-button {
      cursor: pointer;

      &:hover {
        color: #2196F3;
      }
    }
  }

  .title-icon {
    font-size: 15px;
  }

  .paperInfo-box {
    margin: 20px auto 0;
    width: 60%;
  }

  // 发布者信息 开始
  .publisher-info {
    padding-left: 320px;
  }
  // 发布者信息 结束
}
</style>
