<template>
  <div class="user-box">
    <el-row :gutter="20">
      <el-col :span="6">
        <user-card />
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人信息" name="account">
              <changeInfo />
            </el-tab-pane>
            <el-tab-pane label="更改头像" name="headIcon">
              <changeHeadIcon />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userCard from './children/userCard'
import changeInfo from './children/changeInfo'
import changeHeadIcon from './children/changeHeadIcon'

export default {
  name: 'UserInfo',
  components: {
    userCard,
    changeInfo,
    changeHeadIcon
  },
  data() {
    return {
      // 当前显示tabs
      activeTab: 'account'
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped lang="scss">
  .user{
    &-box{
      margin: 20px;
    }
    &-title{
      font-weight: 700;
      font-size: 15px;
    }
  }
</style>
