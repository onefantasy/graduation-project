<template>
  <div class="mine-box">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="考过的试卷" name="examed">
        <span slot="label"><i class="el-icon-document" /> 考过的试卷</span>
        <examed-paper />
      </el-tab-pane>
      <el-tab-pane label="创建的试卷" name="created">
        <span slot="label"><i class="el-icon-edit-outline" /> 创建的试卷</span>
        <my-paper />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myPaper from '../children/myPaper'
import examedPaper from '../children/examedPaper'
export default {
  name: 'Mine',
  components: {
    myPaper,
    examedPaper
  },
  data() {
    return {
      // 当前选中的tab
      activeName: 'examed'
    }
  }
}
</script>

<style lang="scss" scoped>
.mine-box {
  padding: 20px;
}
</style>
