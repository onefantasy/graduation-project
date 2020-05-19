<template>
  <div>
    <el-button :loading="downloadLoading" type="success" size="mini" style="margin-bottom: 15px;" @click="downloadExcel">下载excel</el-button>

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

      <el-table-column prop="startExam" label="开考时间" align="center" show-overflow-tooltip />

      <el-table-column prop="endExam" label="交卷时间" align="center" show-overflow-tooltip />

      <el-table-column prop="timeExam" label="考试用时" align="center" show-overflow-tooltip />

      <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteRecord(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import fun from '@/mixin/fun'
import { parseTime } from '@/utils'
export default {
  mixins: [fun],
  props: {
    // 需要渲染的数据
    tableData: {
      type: Array,
      default() {
        return false
      }
    },
    // 试卷id
    paperId: {
      type: String,
      required: true,
      default: ''
    },
    // 试卷标题
    paperTitle: {
      type: String,
      default: '默认标题'
    },
    // 班级
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 默认头像
      defaultHeadIcon: '',

      // 下载状态
      downloadLoading: false
    }
  },
  created() {
    // 从仓库获取默认头像
    this.defaultHeadIcon = this.$store.getters.constant.defaultHeadIcon
  },
  methods: {
    // 删除考试记录
    deleteRecord(row) {
      this.$confirm('确定删除该考生的考试记录，删除之后该考生可再次考试？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          eid: row.eid,
          paperId: this.paperId
        }
        this.execDelete(data)
      }).catch(() => {})
    },
    // 执行删除记录
    execDelete(data) {
      this.$store.dispatch('exam/deleteExamRecord', data).then(res => {
        this.$message.success('删除成功！')
        // 通知父组件删除成功
        this.$emit('deleteRecorded', data.paperId)
      })
    },
    // 下载excel表格
    downloadExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // excel表头
        const tHeader = [
          '名次',
          '姓名',
          '学校',
          '专业',
          '班级',
          '编号',
          '总分',
          '单选',
          '多选',
          '判断',
          '填空',
          '问答',
          '开考时间',
          '交卷时间',
          '考试用时'
        ]
        // 数据项
        const filterVal = [
          'rank',
          'user.name',
          'user.school',
          'user.major',
          'user.class',
          'user.number',
          'scoreExam',
          'singlesExam',
          'multiplesExam',
          'judgesExam',
          'completionsExam',
          'essaysExam',
          'startExam',
          'endExam',
          'timeExam'
        ]
        // 数据
        const list = this.tableData
        // 格式化数据
        const data = this.formatJson(filterVal, list)
        // 生成的文件名
        const filename = this.paperTitle + this.className + '班级成绩单'
        // 到处操作
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    // 格式化表格数据
    formatJson(filterVal, jsonData) {
      return jsonData.map((v, index) => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (j === 'rank') {
          return index + 1
        } else if (j.indexOf('.') !== -1) {
          const arr = j.split('.')
          let res = v
          arr.map(item => {
            res = res[item]
          })
          const isObject = res instanceof Object
          return isObject ? '表格无法存储对象' : res
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>

</style>
