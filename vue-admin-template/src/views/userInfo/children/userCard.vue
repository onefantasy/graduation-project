<template>
  <el-card class="user-card">
    <div slot="header">
      <span class="user-title">关于我</span>
    </div>
    <div class="user-headIcon">
      <el-image :src="userInfo.headIcon || defaultHeadIcon" :preview-src-list="[userInfo.headIcon || defaultHeadIcon]">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
    </div>
    <div class="middle">
      <div class="name">{{ userInfo.name }}</div>
      <div class="role">{{ {'T':'教师', 'S':'学生'}[userInfo.role] }}</div>
    </div>
    <div class="info-box">
      <div class="info">
        <span class="info-title">学校：</span>
        <span class="info-content">{{ userInfo.school }}</span>
      </div>
      <div class="info">
        <span class="info-title">专业：</span>
        <span class="info-content">{{ userInfo.major }}</span>
      </div>
      <div class="info">
        <span class="info-title">班级：</span>
        <span class="info-content">{{ userInfo.class }}</span>
      </div>
      <div class="info">
        <span class="info-title">学号：</span>
        <span class="info-content">{{ userInfo.number }}</span>
      </div>
      <div class="info">
        <span class="info-title">性别：</span>
        <span class="info-content">{{ ['女', '男'][userInfo.sex] }}</span>
      </div>
      <div class="info">
        <span class="info-title">年龄：</span>
        <span class="info-content">{{ userInfo.age }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserCard',
  components: {},
  data() {
    return {
      // 默认头像
      defaultHeadIcon: ''
    }
  },
  computed: {
    // 用户信息
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    // 从仓库获取默认头像
    this.defaultHeadIcon = this.$store.getters.constant.defaultHeadIcon
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.user-headIcon{
  text-align: center;
  img{
    width: 100px;
    border-radius: 10px;
  }
}
  .middle{
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .name{
      font-weight: bold;
    }
    .role{
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }
  }

  .info-box{
    padding-top: 10px;
  }

  .info{
    padding: 5px 0;
    &-title{
      display: inline-block;
      width: 80px;
      font-weight: 700;
    }
    &-content{
      color: #777;
    }
  }
</style>
