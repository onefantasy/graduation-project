<template>
  <div class="dashboard-container">
    <!-- 欢迎标语 开始 -->
    <div class="welcome">
      <div>在线考试系统欢迎您</div>
    </div>
    <!-- 欢迎标语 结束 -->

    <!-- 主体内容 开始 -->
    <el-row :gutter="20">
      <el-col class="dashboard-item" :span="8">
        <div class="title">
          用户信息
          <span class="operation" @click="goPage('/userInfo/index')">修改 <i class="el-icon-d-arrow-right" /></span>
        </div>
        <div class="user-info">
          <el-image class="headIcon" :src="userInfo.headIcon || defaluteHeadIcon" />
          <div>{{ userInfo.school }}</div>
          <div>{{ userInfo.major }}</div>
          <div>{{ userInfo.class }}</div>
          <div>{{ userInfo.name }}</div>
          <div>{{ userInfo.role === 'S' ? '学生' : '教师' }}</div>
          <div>{{ userInfo.number }}</div>
        </div>
      </el-col>
      <el-col class="bl10 dashboard-item" :span="16">
        <div class="title">
          考试信息
          <span class="operation" @click="goPage('/paper/mine')">更多详情 <i class="el-icon-d-arrow-right" /></span>
        </div>
        <div class="records">
          <div v-if="!records.length" class="not-examRecord">暂无记录</div>
          <div v-if="userInfo.role === 'S'">
            <el-row v-for="item in records" :key="item.eid" class="record-item">
              <el-col class="paper-title" :span="16">◉ {{ item.paperTitle }}</el-col>
              <el-col class="score" :span="8">{{ item.scoreExam }} / {{ item.paper.totalScore }}</el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row v-for="(item, index) in records" :key="index" class="record-item">
              <el-col class="paper-title" :span="16">◉ {{ item.paperTitle }}</el-col>
              <el-col class="score" :span="8">{{ item.publish ? item.examRecords.length + '人' : '未发布'}}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 主体内容 结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      // 默认头像
      defaluteHeadIcon: '',

      // 考试记录
      records: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    // 获取默认头像
    this.defaluteHeadIcon = this.$store.getters.constant.defaluteHeadIcon
    if (this.userInfo.role === 'T') {
      // 请求教师试卷考试信息
      this.getPapersAllCount()
    } else {
      // 请求学生考试记录
      this.getExamedPaper()
    }
  },
  methods: {
    // 跳转到其他页面
    goPage(path) {
      if (!path) return false
      this.$router.push(path)
    },
    // 请求学生考试记录
    getExamedPaper() {
      const params = {
        page: 1,
        pageSize: 10,
        ...this.searchKeys
      }
      // 发起请求
      this.$store.dispatch('exam/getExamedPaper', params).then(res => {
        this.records = res.data
      })
    },
    // 获取教师考试记录
    getPapersAllCount() {
      this.$store.dispatch('paper/getPapersAllCount').then(res => {
        this.records = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 20px;
  font-weight: 700;
  .dashboard-text {
    font-size: 30px;
    line-height: 46px;
  }
  .flex-box {
    display: flex;
  }
  .welcome {
    border-bottom: 10px solid #333;
    div {
      font-size: 50px;
      line-height: 80px;
    }
  }
  .bl10 {
    border-left: 10px solid #333;
    min-height: calc(100vh - 194px);
  }
  .dashboard-item {
    padding: 20px;
    .title {
      font-size: 25px;
      border-bottom: 5px solid #999;
      padding-bottom: 10px;
      line-height: 30px;
      .operation {
        float: right;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .not-examRecord {
      font-size: 40px;
      text-align: center;
      line-height: 80px;
      color: rgba(63, 63, 63, .3);
      cursor: none;
    }
    .user-info {
      >div {
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          font-size: 30px;
        }
      }
      .headIcon {
        margin: 10px 15%;
        width: 70%;
        &:hover {
          transform: scale(1);
        }
      }
    }
    .records {
      line-height: 40px;
      .record-item {
        font-weight: 400;
        .paper-title {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .score {
          text-align: right;
        }
      }
    }
  }
}
</style>
