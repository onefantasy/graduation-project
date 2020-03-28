<template>
  <div class="my-paper-box">
    <!-- 查询 开始 -->
    <div class="search-box">
      <el-input v-model="searchKeys.paperId" clearable placeholder="试卷编号" />
      <el-input v-model="searchKeys.paperTitle" clearable placeholder="试卷标题" />
      <el-input v-model="searchKeys.subject" clearable placeholder="科目" />
      <el-select v-model="searchKeys.publish" clearable placeholder="发布状态">
        <el-option
          v-for="item in publishState"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button icon="el-icon-search" class="fr" @click.stop="search" />
    </div>
    <!-- 查询 结束 -->

    <!-- 表格 开始 -->
    <div>
      <el-table :data="paperList" border stripe>

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

        <el-table-column prop="publish" label="发布" align="center" width="110px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-sort" :type="scope.row.publish ? 'success':'warning'" size="mini" @click="changePublish(scope.row)">{{ scope.row.publish ? '已发布' : '未发布' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="startTime" label="开考时间" align="center" show-overflow-tooltip />

        <el-table-column prop="endTime" label="截止时间" align="center" show-overflow-tooltip />

        <el-table-column prop="time" label="考试用时" align="center" show-overflow-tooltip />

        <el-table-column prop="singles" label="单选题量" align="center" show-overflow-tooltip />

        <el-table-column prop="singlesScore" label="单选总分" align="center" show-overflow-tooltip />

        <el-table-column prop="multiples" label="多选题量" align="center" show-overflow-tooltip />

        <el-table-column prop="multiplesScore" label="多选总分" align="center" show-overflow-tooltip />

        <el-table-column prop="judges" label="判断题量" align="center" show-overflow-tooltip />

        <el-table-column prop="judgesScore" label="判断总分" align="center" show-overflow-tooltip />

        <el-table-column prop="completions" label="填空题量" align="center" show-overflow-tooltip />

        <el-table-column prop="completionsScore" label="填空总分" align="center" show-overflow-tooltip />

        <el-table-column prop="essays" label="问答题量" align="center" show-overflow-tooltip />

        <el-table-column prop="essaysScore" label="问答总分" align="center" show-overflow-tooltip />

        <el-table-column prop="text" label="试卷说明" align="center" width="95px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="success" @click="watchText(scope.row.text)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="270">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit-outline" size="mini" type="info" @click="amend(scope.row.paperId)">修改</el-button>
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="goEdit(scope.row)">编辑</el-button>
            <el-button icon="el-icon-remove-outline" size="mini" type="danger" @click="deletePaper(scope.row)">删除</el-button>
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
// 导入混入文件
import fun from '@/mixin/fun'
export default {
  mixins: [fun],
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
      textDialog: false,

      // 查询关键字
      searchKeys: {
        paperId: '', // 试卷编码
        paperTitle: '', // 试卷标题
        subject: '', // 科目
        publish: '' // 试卷发布状态
      },

      // 获取试卷发布状态
      publishState: []
    }
  },
  created() {
    // 获取试卷发布状态
    this.publishState = this.$store.getters.constant.publishState

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
        ...this.searchKeys
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
    },
    // 查询试卷
    search() {
      this.page = 1
      this.getPapers()
    },
    // 更改试卷发布状态
    changePublish(row) {
      const data = {
        paperId: row.paperId,
        publish: row.publish
      }
      const text = row.publish ? '撤回成功！' : '发布成功！'
      // 发出请求
      this.$store.dispatch('paper/changePublish', data).then(res => {
        this.$message.success(text)
        this.getPapers()
      })
    }
  }
}
</script>

<style lang="scss">
.my-paper-box {
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
.my-paper-box {
  .pagination{
    margin-top: 10px;
  }

  .fr {
    float: right;
  }
}
</style>
