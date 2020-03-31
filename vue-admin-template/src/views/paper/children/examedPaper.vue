<template>
  <div class="examedPaper-box">
    <!-- 查询 开始 -->
    <div class="search-box">
      <el-input v-model="searchKeys.paperId" clearable placeholder="试卷编号" />
      <el-input v-model="searchKeys.paperTitle" clearable placeholder="试卷标题" />
      <el-input v-model="searchKeys.subject" clearable placeholder="科目" />
      <el-button icon="el-icon-search" class="fr" @click.stop="search" />
    </div>
    <!-- 查询 结束 -->

    <!-- 表格 开始 -->
    <div>
      <el-table :data="examRecords" border stripe>

        <el-table-column label="序号" width="50" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ computedIndex(scope.$index) }}
          </template>
        </el-table-column>

        <el-table-column prop="paper.paperId" label="试卷编号" align="center" show-overflow-tooltip />

        <el-table-column prop="paper.paperTitle" label="试卷标题" align="center" show-overflow-tooltip />

        <el-table-column prop="paper.subject" label="科目" align="center" show-overflow-tooltip />

        <el-table-column prop="paper.user.name" label="出卷人" align="center" show-overflow-tooltip />

        <el-table-column prop="scoreExam" label="总得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.scoreExam) }} / {{ scope.row.paper.totalScore }}
          </template>
        </el-table-column>

        <el-table-column prop="singlesExam" label="单选得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.singlesExam) }} / {{ scope.row.paper.singlesScore }}
          </template>
        </el-table-column>

        <el-table-column prop="multiplesExam" label="多选得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.multiplesExam) }} / {{ scope.row.paper.multiplesScore }}
          </template>
        </el-table-column>

        <el-table-column prop="judgesExam" label="判断得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.judgesExam) }} / {{ scope.row.paper.judgesScore }}
          </template>
        </el-table-column>

        <el-table-column prop="completionsExam" label="填空得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.completionsExam) }} / {{ scope.row.paper.completionsScore }}
          </template>
        </el-table-column>

        <el-table-column prop="essaysExam" label="问答得分" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ showScore(scope.row.essaysExam) }} / {{ scope.row.paper.essaysScore }}
          </template>
        </el-table-column>

        <el-table-column prop="startExam" label="开考时间" align="center" show-overflow-tooltip />

        <el-table-column prop="endExam" label="交卷时间" align="center" show-overflow-tooltip />

        <el-table-column prop="timeExam" label="考试用时" align="center" show-overflow-tooltip />

        <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="120">
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="success" @click="showDetail(scope.row.eid, scope.row.paper.paperId)">查看详情</el-button>
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
  </div>
</template>

<script>
// 导入混入文件
import fun from '@/mixin/fun'
export default {
  components: {},
  mixins: [fun],
  data() {
    return {
      // 当前表格的页码
      page: 1,

      // 当前表格每页显示的数量
      pageSize: 10,

      // 可选择的显示每页的数据数量
      pageSizes: [2, 10, 20, 30],

      // 试卷列表的数据总量
      total: 0,

      // 考试信息记录
      examRecords: [],

      // 查询关键字
      searchKeys: {
        paperId: '', // 试卷编码
        paperTitle: '', // 试卷标题
        subject: '' // 科目
      }
    }
  },
  created() {
    // 请求数据
    this.getExamedPaper()
  },
  methods: {
    // 请求考试记录
    getExamedPaper() {
      const params = {
        page: 1,
        pageSize: 10,
        ...this.searchKeys
      }
      // 发起请求
      this.$store.dispatch('exam/getExamedPaper', params).then(res => {
        this.total = res.total
        this.examRecords = res.data
      })
    },
    // 搜索
    search() {
      this.getExamedPaper()
    },
    // 每页显示数量发生改变
    handleSizeChange(e) {
      this.searchKeys.pageSize = e
      this.getExamedPaper()
    },
    // 页码发生改变
    handleCurrentChange(e) {
      this.searchKeys.page = e
      this.getExamedPaper()
    },
    // 显示当前得分
    showScore(score) {
      if (score !== 0 && !score) {
        return '尚未批改'
      }
      return score
    },
    // 查看某次考试记录的详情
    showDetail(eid, pid) {
      this.$router.push(`/exam/examDetail?e=${eid}&p=${pid}`)
    }
  }
}
</script>

<style lang="scss">
.examedPaper-box {
  .search-box {
    margin-bottom: 10px;
    background: #E4E7ED;
    padding: 5px;
    border: 1px solid #D3D6DC;
    border-radius: 5px;

    .el-input {
      width: 250px;
      margin-left: 5px;
    }
  }
}
</style>

<style lang="scss" scoped>
.examedPaper-box {
  .pagination{
    margin-top: 10px;
  }

  .fr {
    float: right;
  }
}
</style>
