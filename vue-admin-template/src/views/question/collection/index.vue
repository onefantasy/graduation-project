<template>
  <div class="collection">
    <!-- 选择题目类型 开始 -->
    <el-form>
      <el-form-item label="题型">
        <el-select v-model="type" placeholder="请选择" @change="getCollecQuestions">
          <el-option
            v-for="item in questionTypes"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 选择题目类型 结束 -->

    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div v-html="scope.row.content" />
          <div v-for="item in selectOptions" :key="item">
            <div v-if="scope.row[item]" class="flex-box">
              <span class="lh44">{{ item }}、</span>
              <span v-html="scope.row[item]" />
            </div>
          </div>
          <div class="lh44">分值：{{ scope.row.score }}</div>
          <div v-if="type !== 'essays'">参考答案：{{ scope.row.rightKey }}</div>
          <div v-else>
            <p>
              参考答案：
            </p>
            <div v-html="scope.row.rightKey" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="序号" type="index" align="center" show-overflow-tooltip />

      <el-table-column label="收藏时间" prop="createdAt" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ formatTime(scope.row.createdAt) }}</template>
      </el-table-column>

      <el-table-column label="标题" prop="title" align="center" show-overflow-tooltip />

      <el-table-column label="来源" prop="from" align="center" show-overflow-tooltip />

      <el-table-column label="作者" prop="auth" align="center" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script>
import fun from '@/mixin/fun'
export default {
  mixins: [fun],
  data() {
    return {
      // 表格数据
      tableData: [],

      // 总数量
      total: 0,

      // 选择题选项
      selectOptions: [],

      // 当前题目类型
      type: '',

      // 所有的题目类型
      questionTypes: []
    }
  },
  created() {
    // 从仓库获取选择题选项
    this.selectOptions = this.$store.getters.constant.selectOptions

    // 获取所有的题目类型
    this.questionTypes = this.$store.getters.constant.question.types
    this.type = this.questionTypes[0].type

    // 请求题目列表数据
    this.getCollecQuestions()
  },
  methods: {
    // 获取题目列表
    getCollecQuestions() {
      // 参数
      const params = {
        state: this.$store.getters.constant.question.state.collection,
        type: this.type
      }
      // 发起请求
      this.$store.dispatch('question/getCollecQuestions', params).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.collection {
  padding: 20px;

  .flex-box {
    display: flex;
  }

  .lh44 {
    line-height: 44px;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
