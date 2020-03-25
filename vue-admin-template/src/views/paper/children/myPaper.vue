<template>
  <div class="my-paper-box">
    <!-- 表格 开始 -->
    <div>
      <el-table :data="paperList" border>

        <el-table-column label="序号" width="50" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ computedIndex(scope.$index) }}
          </template>
        </el-table-column>

        <el-table-column prop="paperId" label="试卷编号" align="center" show-overflow-tooltip />

        <el-table-column prop="paperTitle" label="试卷标题" align="center" show-overflow-tooltip />

        <el-table-column prop="subject" label="科目" align="center" show-overflow-tooltip />

        <el-table-column prop="createdAt" label="创建时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column prop="startTime" label="开考时间" align="center" show-overflow-tooltip />

        <el-table-column prop="endTime" label="截止时间" align="center" show-overflow-tooltip />

        <el-table-column prop="time" label="考试用时" align="center" show-overflow-tooltip />

        <el-table-column prop="single" label="单选题量" align="center" show-overflow-tooltip />

        <el-table-column prop="singleScore" label="单选总分" align="center" show-overflow-tooltip />

        <el-table-column prop="multiple" label="多选题量" align="center" show-overflow-tooltip />

        <el-table-column prop="multipleScore" label="多选总分" align="center" show-overflow-tooltip />

        <el-table-column prop="judge" label="判断题量" align="center" show-overflow-tooltip />

        <el-table-column prop="judgeScore" label="判断总分" align="center" show-overflow-tooltip />

        <el-table-column prop="completion" label="填空题量" align="center" show-overflow-tooltip />

        <el-table-column prop="completionScore" label="填空总分" align="center" show-overflow-tooltip />

        <el-table-column prop="essay" label="问答题量" align="center" show-overflow-tooltip />

        <el-table-column prop="essayScore" label="问答总分" align="center" show-overflow-tooltip />

        <el-table-column prop="text" label="试卷说明" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="watchText(scope.row.text)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="amend(scope.row.paperId)">修改</el-button>
            <el-button size="mini" type="primary" @click="goEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="success">发布</el-button>
            <el-button size="mini" type="danger" @click="deletePaper(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :current-page="page"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 表格 结束 -->

    <!-- 显示试卷说明的弹窗 开始 -->
    <el-dialog :visible.sync="textDialog" title="试卷说明">
      {{ text }}
    </el-dialog>
    <!-- 显示试卷说明的弹窗 结束 -->
  </div>
</template>

<script>
export default {
  props: {
    // 页面类型（考过的试卷-exams、创建的试卷-created）
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 当前表格的页码
      page: 1,

      // 当前表格每页显示的数量
      pageSize: 10,

      // 可选择的显示每页的数据数量
      pageSizes: [2, 10, 20, 30],

      // 试卷列表信息
      paperList: [],

      // 试卷列表的数据总量
      total: 0,

      // 当前正在查看的试卷说明
      text: '',

      // 是否显示查看试卷说明的弹窗
      textDialog: false
    }
  },
  created() {
    // 请求数据
    this.getPapers()
  },
  methods: {
    // 获取试卷列表信息
    getPapers() {
      // 合成参数
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        type: this.type
      }
      // 发起请求
      this.$store.dispatch('paper/getPapers', params).then(res => {
        this.paperList = res.data
        this.total = res.total

        if (this.total === 0) {
          this.$message.warning('暂无试卷信息！')
        }
      })
    },
    // 计算表格序号
    computedIndex(index) {
      return (this.page - 1) * this.pageSize + index + 1
    },
    // 格式化时间
    formatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 查看试卷说明
    watchText(text) {
      this.text = text
      this.textDialog = true
    },
    // 表格每页显示数量更改
    handleSizeChange(e) {
      this.pageSize = e
      this.getPapers()
    },
    // 更改表格显示页码
    handleCurrentChange(e) {
      this.page = e
      this.getPapers()
    },
    // 删除试卷
    deletePaper(row) {
      this.$confirm(`确定要删除试卷 ${row.paperTitle} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$store.dispatch('paper/detelePaper', { paperId: row.paperId })
      }).then(res => {
        this.$message.success('成功删除试卷')
        this.getPapers()
      }).catch(() => {
        this.$message.info('取消删除试卷')
      })
    },
    // 跳转到编辑试卷页面
    goEdit(row) {
      this.$router.push('/paper/edit/' + row.paperId)
    },
    // 修改试卷配置
    amend(id) {
      this.$router.push('/paper/create?code=' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-paper-box {
  .pagination{
    margin-top: 10px;
  }
}
</style>
