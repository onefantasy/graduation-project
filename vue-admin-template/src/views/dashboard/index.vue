<template>
  <div class="dashboard-container">
    <!-- 系统标题 开始 -->
    <div class="title">
      <mallki class-name="mallki-text" text="在线考试系统" />
    </div>
    <!-- 系统标题 结束 -->
    <!-- 个人信息 开始 -->
    <el-card shadow="never" class="borderBottom">
      <div slot="header" class="clearfix header">
        <mallki class-name="mallki-text" text="个人信息" />
        <span class="more" @click="goPage('/userInfo/index')">更改 <i class="el-icon-caret-right" /> </span>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-image :src="userInfo.headIcon || defaluteHeadIcon" />
          </el-col>
          <el-col :span="18">
            <el-form :inline="true" label-width="100px">
              <el-form-item label="姓名:">
                <span class="form-font">{{ userInfo.name }}</span>
              </el-form-item>
              <el-form-item label="学校:">
                <span class="form-font">{{ userInfo.school }}</span>
              </el-form-item>
              <el-form-item label="专业:">
                <span class="form-font">{{ userInfo.major }}</span>
              </el-form-item>
              <el-form-item label="班级:">
                <span class="form-font">{{ userInfo.class }}</span>
              </el-form-item>
              <el-form-item label="学号:">
                <span class="form-font">{{ userInfo.number }}</span>
              </el-form-item>
              <el-form-item label="身份:">
                <span class="form-font">{{ roles[userInfo.role] }}</span>
              </el-form-item>
              <el-form-item label="性别:">
                <span class="form-font">{{ sexs[userInfo.sex] }}</span>
              </el-form-item>
              <el-form-item label="注册时间:">
                <span class="form-font">{{ formatTime(userInfo.createdAt) }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 个人信息 结束 -->
    <!-- 考试情况 开始 -->
    <el-card shadow="never" class="borderBottom">
      <div slot="header" class="clearfix header">
        <mallki class-name="mallki-text" text="考试情况" />
        <span class="more" @click="goPage('/paper/mine')">更多 <i class="el-icon-caret-right" /> </span>
      </div>
      <div class="records">
        <div v-if="!records.length" class="not-examRecord">暂无记录</div>
        <div v-if="userInfo.role === 'S'">
          <el-row v-for="item in records" :key="item.eid" class="record-item">
            <el-col class="paper-title" :span="16">◉ {{ item.paperTitle }}</el-col>
            <el-col class="score" :span="8">{{ item.scoreExam }}分 / {{ item.paper.totalScore }}分</el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row v-for="(item, index) in records" :key="index" class="record-item">
            <el-col class="paper-title" :span="16">◉ {{ item.paperTitle }}</el-col>
            <el-col class="score" :span="8">{{ item.publish ? item.examRecords.length + '人' : '未发布' }}</el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <!-- 考试情况 结束 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Mallki from '@/components/Mallki'
import fun from '@/mixin/fun'
export default {
  name: 'Dashboard',
  components: {
    Mallki
  },
  mixins: [fun],
  data() {
    return {
      // 默认头像
      defaluteHeadIcon: '',

      // 考试记录
      records: [],

      // 身份
      roles: {},

      // 性别
      sexs: []
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
    // 从仓库获取身份
    this.roles = this.$store.getters.constant.roles
    // 从仓库获取性别
    this.sexs = this.$store.getters.constant.sexs
    if (this.userInfo.role === 'T') {
      // 获取教师试卷考试信息
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
    // 获取教师试卷考试信息
    getPapersAllCount() {
      this.$store.dispatch('paper/getPapersAllCount').then(res => {
        this.records = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$tipColor: #333;
$contentColor: #666;
$fontWeight: 700;

.dashboard-container {
  padding: 20px;
  font-size: $fontWeight;

  .title {
    font-size: 20px;
    color: $contentColor;
    line-height: 40px;
    border-bottom: 2px solid $contentColor;
  }

  .header {
    font-weight: $fontWeight;
    color: $tipColor;
  }

  .form-font {
    font-weight: $fontWeight;
    color: $contentColor;
  }

  .borderBottom {
    border-bottom: 2px solid $contentColor;
  }

  .more {
    cursor: pointer;
    float: right;
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
</style>
