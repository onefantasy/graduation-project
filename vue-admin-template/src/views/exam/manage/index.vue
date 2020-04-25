<template>
  <div ref="manegeBox" class="manage-box" :class="{ backgroundGray: overall }">
    <!-- 试卷编号搜索框 开始 -->
    <transition name="el-fade-in-linear">
      <MDinput v-if="!overall" v-model="paperId" class="paperId-input">
        <span>试卷编号</span>
        <span slot="append" class="search-button"><i class="el-icon-search" @click="search" /></span>
      </MDinput>
    </transition>
    <!-- 试卷编号搜索框 结束 -->
    <!-- 统计部分 开始 -->
    <transition name="el-fade-in-linear">
      <div v-if="overall" class="t1">

        <!-- 返回与改卷按钮 开始 -->
        <div>
          <el-button icon="el-icon-d-arrow-left" @click="reset">返回搜索</el-button>
          <el-button style="float: right;" type="primary" @click="goMark">批卷 <i class="el-icon-d-arrow-right" /></el-button>
        </div>
        <!-- 返回与改卷按钮 结束 -->

        <panel-group :show-arr="recordArr" />

        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <pie-chart :chart-data-name="scoreLevel" :chart-data="scoreLevelPeople" title="分数统计" tooltip-name="人数(百分比)" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="16">
            <div class="chart-wrapper">
              <bar-chart :chart-data-name="types" :chart-data="typeScore" title="各题平均分" />
            </div>
          </el-col>
        </el-row>

        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-data" /> 统计图</span>
            <rank-chart :total-score="config.totalScore" :chart-data="examinee" />
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-grid" /> 表格</span>
            <rank-table :table-data="overall" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </transition>
    <!-- 统计部分 结束 -->
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import panelGroup from '../children/panelGroup'
import pieChart from '../children/pieChart'
import barChart from '../children/barChart'
import rankTable from '../children/rankTable'
import rankChart from '../children/rankChart'
export default {
  components: {
    MDinput,
    panelGroup,
    pieChart,
    barChart,
    rankTable,
    rankChart
  },
  data() {
    return {
      // 加载遮罩
      load: null,

      // 搜索用的试卷id
      paperId: 'p1585235112914',

      // 所有的考试记录
      overall: '',

      // 试卷配置
      config: '',

      // 分数划分的层次数
      scoreLevelNumber: 5,

      // 分数等级
      scoreLevel: [],

      // 分数各个等级的人数
      scoreLevelPeople: [],

      // 考试记录的数量
      examNumber: 0,

      // 记录数组【考试人数，最高分，平均分，平均用时[时，分，秒]】
      recordArr: [0, 0, 0, [0, 0, 0]],

      // 所有题型的数据
      questionTypes: [],

      // 存储改试卷题型的数组
      types: [],

      // 每种题型的平均分数组
      typeScore: [],

      // 每位考生的统计数据
      examinee: {
        name: [], // 考生名字
        total: [], // 总得分
        singles: [], // 单选题得分
        multiples: [], // 多选题得分
        judges: [], // 判断题得分
        completions: [], // 填空题得分
        essays: [] // 问答题得分
      }
    }
  },
  created() {
    // 从仓库获取所有的题型
    this.questionTypes = this.$store.getters.constant.question.types
  },
  methods: {
    // 开启遮罩
    openLoad() {
      this.load = this.$loading({ target: this.$refs['manegeBox'] })
    },
    // 关闭遮罩
    closeLoad() {
      if (this.load) this.load.close()
    },
    // 根据paperId获取某张试卷的考试整体情况（教师专用接口，用于统计考试情况）
    getExamOverall() {
      // 参数
      const params = {
        paperId: this.paperId
      }
      // 发起请求
      this.$store.dispatch('exam/getExamOverallByPid', params).then(res => {
        this.overall = res.data
        this.examNumber = this.overall.length
        // 统计数据
        this.statistics()
      }).finally(() => {
        this.closeLoad()
      })
    },
    // 根据试卷id获取试卷详情
    getPaperDetail() {
      // 参数
      const params = {
        paperId: this.paperId
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        this.config = res.data.config
        this.getExamOverall()
      }).catch(() => {
        // this.$message.error('试卷信息获取失败，请稍后重试')
        this.closeLoad()
      })
    },
    // 点击查询按钮
    search() {
      if (!this.paperId) {
        this.$message.warning('请先输入试卷编号！')
        return false
      }
      this.openLoad()
      // this.getExamOverall()
      this.getPaperDetail()
    },
    // 统计数据
    statistics() {
      // 统计总分，最后用于计算平均分
      let totalScore = 0
      // 统计总用时，最后用于计算平均时间
      let totalTime = 0
      // 考试总人数（数据量）
      const l = this.overall.length
      // 分数层级之间的步数
      const step = this.config.totalScore / this.scoreLevelNumber
      // 初始化层级数组的数据
      for (let i = 0, len = this.scoreLevelNumber; i < len; i++) {
        this.scoreLevel.push(`${i * step}~${(i + 1) * step}`)
        this.scoreLevelPeople.push(0)
      }
      // 初始化题型的数组
      for (let i = 0, len = this.questionTypes.length; i < len; i++) {
        if (this.config[this.questionTypes[i].type]) {
          this.types.push(this.questionTypes[i])
          this.typeScore.push(0)
        }
      }
      // 便利循环处理
      for (let i = 0; i < l; i++) {
        totalScore += +this.overall[i].scoreExam
        totalTime += this.formatTimeToSecond(this.overall[i].timeExam)
        // 分数等级统计
        let level = parseInt(+this.overall[i].scoreExam / step)
        level === this.scoreLevelNumber && level--
        this.scoreLevelPeople[level]++
        // 每种题型的分数统计
        for (let j = 0, len = this.types.length; j < len; j++) {
          this.typeScore[j] += +this.overall[i][this.types[j].type + 'Exam']
        }
        // 记录每位考生的数据统计
        this.examinee.name.push(this.overall[i].user.name)
        this.examinee.total.push(this.overall[i].scoreExam)
        for (let j = 0, len = this.questionTypes.length; j < len; j++) {
          this.examinee[this.questionTypes[j].type].push(this.overall[i][this.questionTypes[j].type + 'Exam'])
        }
      }
      // 记录数据
      this.recordArr[0] = l || 0 // 考试人数
      this.recordArr[1] = this.overall[0].scoreExam || 0 // 考试最高分
      this.recordArr[2] = totalScore / l || 0 // 平均分
      this.recordArr[3] = this.formatSecondToTime(parseInt(totalTime / l)) || 0 // 平均用时
      // 每种题型的分数处理
      for (let i = 0, len = this.types.length; i < len; i++) {
        this.types[i] = this.types[i].name
        this.typeScore[i] = this.typeScore[i] / l || 0
      }
    },
    // 将字符串时间转换为秒数
    formatTimeToSecond(time) {
      const arr = time.split(':')
      return (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2])
    },
    // 将秒数转换为字符串时间
    formatSecondToTime(seconds) {
      const arr = []
      arr[0] = parseInt(seconds / 3600)
      arr[1] = parseInt((seconds - arr[0] * 3600) / 60)
      arr[2] = seconds % 60
      return arr
    },
    // 重置
    reset() {
      // 搜索用的试卷id
      this.paperId = ''

      // 所有的考试记录
      this.overall = ''

      // 试卷配置
      this.config = ''

      // 分数各个等级的人数
      this.scoreLevelPeople = []

      // 考试记录的数量
      this.examNumber = 0

      // 记录数组【考试人数，最高分，平均分，平均用时[时，分，秒]】
      this.recordArr = [0, 0, 0, [0, 0, 0]]

      // 存储改试卷题型的数组
      this.types = []

      // 每种题型的平均分数组
      this.typeScore = []

      // 每位考生的统计数据
      this.examinee = {
        name: [], // 考生名字
        total: [], // 总得分
        singles: [], // 单选题得分
        multiples: [], // 多选题得分
        judges: [], // 判断题得分
        completions: [], // 填空题得分
        essays: [] // 问答题得分
      }
    },
    // 跳转到批改试卷页面
    goMark() {
      this.$router.push('/exam/mark?p=' + this.paperId)
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-box {
  padding: 20px;
  transition: all 1s;

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

  .t1 {
    transition: all 1s;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.backgroundGray {
  background-color: rgb(240, 242, 245);
}
</style>
