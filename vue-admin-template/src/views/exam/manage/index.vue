<template>
  <div class="manage-box" :class="{ backgroundGray: overall }">
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
        <panel-group :show-arr="recordArr" />
      </div>
    </transition>
    <!-- 统计部分 结束 -->
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import panelGroup from '../children/panelGroup'
export default {
  components: {
    MDinput,
    panelGroup
  },
  data() {
    return {
      // 搜索用的试卷id
      paperId: 'p1585235112914',

      // 所有的考试记录
      overall: '',

      // 考试记录的数量
      examNumber: 0,

      // 记录数组【考试人数，最高分，平均分，平均用时[时，分，秒]】
      recordArr: [0, 0, 0, [0, 0, 0]]
    }
  },
  created() {},
  methods: {
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
      })
    },
    // 点击查询按钮
    search() {
      if (!this.paperId) {
        this.$message.warning('请先输入试卷编号！')
        return false
      }
      this.getExamOverall()
    },
    // 统计数据
    statistics() {
      console.log('需要统计的数据：', this.overall)
      // 统计总分，最后用于计算平均分
      let totalScre = 0
      // 统计总用时，最后用于计算平均时间
      let totalTime = 0
      // 考试总人数（数据量）
      const l = this.overall.length
      // 便利循环处理
      for (let i = 0; i < l; i++) {
        totalScre += +this.overall[i].scoreExam
        totalTime += this.formatTimeToSecond(this.overall[i].timeExam)
      }
      // 记录数据
      this.recordArr[0] = l || 0
      this.recordArr[1] = this.overall[0].scoreExam || 0
      this.recordArr[2] = totalScre / l || 0
      this.recordArr[3] = this.formatSecondToTime(parseInt(totalTime / l))
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
}
.backgroundGray {
  background-color: rgb(240, 242, 245);
}
</style>
