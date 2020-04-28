<template>
  <div class="userList-box">
    <!-- 查询 开始 -->
    <div class="search-box">
      <el-input v-model="searchKeys.account" clearable placeholder="账号" />
      <el-input v-model="searchKeys.name" clearable placeholder="姓名" />
      <el-input v-model="searchKeys.number" clearable placeholder="编号" />
      <el-select v-model="searchKeys.role" clearable placeholder="身份">
        <el-option
          v-for="item in rolesOptions"
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
      <el-table :data="userList" border stripe @expand-change="expandChange">

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form>
              <el-form-item label="新密码:">
                <el-input v-model="password" style="width: 400px" type="password" show-password />
                <el-button icon="el-icon-edit-outline" type="info" @click="changePassword(scope.row)">修改密码</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="序号" width="50" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ computedIndex(scope.$index) }}
          </template>
        </el-table-column>

        <el-table-column prop="account" label="账号" align="center" show-overflow-tooltip />

        <el-table-column prop="headIcon" label="头像" width="110" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image :src="scope.row.headIcon || defaultHeadIcon" :preview-src-list="[scope.row.headIcon || defaultHeadIcon]" />
          </template>
        </el-table-column>

        <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip />

        <el-table-column prop="role" label="身份" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ roles[scope.row.role] }}
          </template>
        </el-table-column>

        <el-table-column prop="school" label="学校" align="center" show-overflow-tooltip />

        <el-table-column prop="major" label="专业" align="center" show-overflow-tooltip />

        <el-table-column prop="class" label="班级" align="center" show-overflow-tooltip />

        <el-table-column prop="number" label="学号" align="center" show-overflow-tooltip />

        <el-table-column prop="createdAt" label="注册时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column prop="latestTime" label="上次登陆" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.latestTime ? formatTime(scope.row.latestTime) : '' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="210">
          <template slot-scope="scope">
            <el-button v-if="scope.row.role !== 'admin'" icon="el-icon-sort" size="mini" type="success" @click="changeRole(scope.row)">变更身份</el-button>
            <el-button v-if="scope.row.role !== 'admin'" icon="el-icon-remove-outline" size="mini" type="danger" @click="deleteAccount(scope.row)">删除</el-button>
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
import fun from '@/mixin/fun'
export default {
  mixins: [fun],
  data() {
    return {
      // 搜索关键字
      searchKeys: {
        account: '', // 账号
        name: '', // 名称
        number: '', // 学号
        role: '' // 角色
      },

      // 当前表格的页码
      page: 1,

      // 当前表格每页显示的数量
      pageSize: 10,

      // 可选择的显示每页的数据数量
      pageSizes: [2, 10, 20, 30],

      // 试卷列表的数据总量
      total: 0,

      // 用户列表
      userList: [],

      // 角色
      roles: {},

      // 角色选项
      rolesOptions: [],

      // 默认头像
      defaultHeadIcon: null,

      // 更改密码记录的字段
      password: ''
    }
  },
  created() {
    // 获取身份角色
    this.roles = this.$store.getters.constant.roles
    const arr = []
    for (const key in this.roles) {
      const item = {}
      item.label = this.roles[key]
      item.value = key
      arr.push(item)
    }
    this.rolesOptions = arr

    // 获取默认头像
    this.defaultHeadIcon = this.$store.getters.constant.defaultHeadIcon

    // 请求用户列表
    this.getUserList()
  },
  methods: {
    // 请求数据
    getUserList() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchKeys
      }
      // 发送请求
      this.$store.dispatch('user/getUserList', params).then(res => {
        this.total = res.total
        this.userList = res.data
      })
    },
    // 表格每页显示数量更改
    handleSizeChange(e) {
      this.pageSize = e
      this.getUserList()
    },
    // 更改表格显示页码
    handleCurrentChange(e) {
      this.page = e
      this.getUserList()
    },
    // 搜索
    search() {
      this.page = 1
      this.getUserList()
    },
    // 修改密码
    changePassword(row) {
      const data = {
        password: this.password.trim(),
        account: row.account
      }
      // 发送修改密码的请求
      this.$store.dispatch('user/adminChangePassword', data).then(res => {
        this.$message.success('密码更新成功！')
      })
    },
    // 变更身份
    changeRole(row) {
      // 获取角色的key
      const roleKey = Object.keys(this.roles).slice(0, 2)
      // 改变之后的角色
      const role = row.role === roleKey[0] ? roleKey[1] : roleKey[0]
      // 参数
      const data = {
        account: row.account,
        role
      }
      // 角色名称
      // 发起请求
      this.$store.dispatch('user/adminChangeRole', data).then(res => {
        this.$message.success(`${row.name}已经变更为${this.roles[role]}身份！`)
        this.getUserList()
      })
    },
    // 删除角色
    async deleteAccount(row) {
      let flag = true
      await this.$confirm(`确定要删除用户${row.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flag = false
      }).catch(() => {
        flag = true
      })
      if (flag) return false
      // 参数
      const data = {
        account: row.account
      }
      // 请求删除用户
      this.$store.dispatch('user/adminDeleteAccount', data).then(res => {
        this.$message.success('删除角色成功！')
        this.getUserList()
      })
    },
    // 表格行展开或者关闭的回调
    expandChange(row, expand) {
      // 重置记录的密码
      this.password = ''
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
