<template>
  <div class="userList-box">
    <!-- 查询 开始 -->
    <div class="search-box">
      <el-input v-model="searchKeys.name" clearable placeholder="姓名" />
      <el-input v-model="searchKeys.paperTitle" clearable placeholder="试卷标题" />
      <el-input v-model="searchKeys.paperId" clearable placeholder="试卷编号" />
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

        <el-table-column label="试卷标题" align="center" show-overflow-tooltip prop="paperTitle" />

        <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createdAt">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="科目" align="center" show-overflow-tooltip prop="subject" />

        <el-table-column prop="publish" label="发布" align="center" width="110px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-sort" :type="scope.row.publish ? 'success':'warning'" size="mini" @click="changePublish(scope.row)">{{ scope.row.publish ? '已发布' : '未发布' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="出卷人" align="center" show-overflow-tooltip>
          <el-table-column label="姓名" align="center" show-overflow-tooltip prop="user.name" />
          <el-table-column label="学校" align="center" show-overflow-tooltip prop="user.school" />
          <el-table-column label="编号" align="center" show-overflow-tooltip prop="user.number" />
        </el-table-column>

        <el-table-column prop="text" label="试卷说明" align="center" width="95px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="success" @click="watchText(scope.row.text)">查看</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="210">
          12
        </el-table-column> -->
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
import fun from '@/mixin/fun'
export default {
  mixins: [fun],
  data() {
    return {
      // 搜索关键字
      searchKeys: {
        paperTitle: '', // 试卷标题
        name: '', // 名称
        paperId: '', // 试卷编号
        publish: '' // 发布状态
      },

      // 当前表格的页码
      page: 1,

      // 当前表格每页显示的数量
      pageSize: 10,

      // 可选择的显示每页的数据数量
      pageSizes: [2, 10, 20, 30],

      // 试卷列表的数据总量
      total: 0,

      // 获取试卷发布状态
      publishState: [],

      // 试卷信息
      paperList: [],

      // 是否显示试卷说明的窗口
      textDialog: false,

      // 试卷说明内容
      text: ''
    }
  },
  created() {
    // 获取试卷发布状态
    this.publishState = this.$store.getters.constant.publishState

    // 请求用户列表
    this.getPaperist()
  },
  methods: {
    // 请求数据
    getPaperist() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchKeys
      }
      // 发送请求
      this.$store.dispatch('paper/getAdminPaperList', params).then(res => {
        this.total = res.total
        this.paperList = res.data
      })
    },
    // 表格每页显示数量更改
    handleSizeChange(e) {
      this.pageSize = e
      this.getPaperist()
    },
    // 更改表格显示页码
    handleCurrentChange(e) {
      this.page = e
      this.getPaperist()
    },
    // 搜索
    search() {
      this.page = 1
      this.getPaperist()
    },
    // 查询试卷说明
    watchText(text) {
      this.textDialog = true
      this.text = text
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
        this.getPaperist()
      })
    }
  }
}
</script>

<style lang="scss">
.userList-box {
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
.userList-box {
  padding: 20px;

  .pagination{
    margin-top: 10px;
  }

  .fr {
    float: right;
  }
}
</style>
