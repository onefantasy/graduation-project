<template>
  <div class="mine-box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="考过的试卷" name="exams">考过的试卷</el-tab-pane>
      <el-tab-pane label="创建的试卷" name="created">
        <my-paper :type="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myPaper from '../children/myPaper'
export default {
  components: {
    myPaper
  },
  data() {
    return {
      // 当前选中的tab
      activeName: 'created'
    }
  }
}
</script>

<style lang="scss" scoped>
.mine-box {
  padding: 20px;
}
</style>
