<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" wdith="50px" label="序号" align="center" show-overflow-tooltip />

      <el-table-column label="头像" align="center" width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image :src="scope.row.user.headIcon || defaultHeadIcon" :preview-src-list="[scope.row.user.headIcon || defaultHeadIcon]" />
        </template>
      </el-table-column>

      <el-table-column prop="user.name" label="姓名" align="center" show-overflow-tooltip />

      <el-table-column prop="user.school" label="学校" align="center" show-overflow-tooltip />

      <el-table-column prop="user.major" label="专业" align="center" show-overflow-tooltip />

      <el-table-column prop="user.class" label="班级" align="center" show-overflow-tooltip />

      <el-table-column prop="user.number" label="学号" align="center" show-overflow-tooltip />

      <el-table-column prop="scoreExam" label="总分" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="singlesExam" label="单选题" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="multiplesExam" label="多选题" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="judgesExam" label="判断题" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="completionsExam" label="填空题" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="essaysExam" label="问答题" sortable align="center" show-overflow-tooltip />

      <el-table-column prop="timeExam" label="考试用时" align="center" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    // 需要渲染的数据
    tableData: {
      type: Array,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      // 默认头像
      defaultHeadIcon: ''
    }
  },
  created() {
    // 从仓库获取默认头像
    this.defaultHeadIcon = this.$store.getters.constant.defaultHeadIcon
  }
}
</script>

<style>

</style>
