<template>
  <div class="changePassword-box">
    <el-form
      ref="form"
      :model="passwords"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="旧密码" prop="old">
        <el-input v-model="passwords.old" type="password" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newOne">
        <el-input v-model="passwords.newOne" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="newConfirm">
        <el-input v-model="passwords.newConfirm" type="password" show-password placeholder="请再次输入新密码" />
      </el-form-item>
      <div class="form-button">
        <el-button icon="el-icon-finished" class="fr" type="primary" @click="submitForm">确认更改</el-button>
        <el-button icon="el-icon-refresh-left" class="fr mr10" @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 密码表单内容
      passwords: {
        old: '', // 旧密码
        newOne: '', // 新密码
        newConfirm: '' // 确认新密码
      },

      // 表单验证
      rules: {
        old: [{ required: true, message: '请输入旧密码', tigger: 'blur' }],
        newOne: [{ required: true, message: '请输入新密码', tigger: 'blur' }],
        newConfirm: [{ required: true, message: '请再次输入新密码', tigger: 'blur' }]
      }
    }
  },
  methods: {
    // 更改密码的请求
    submitForm() {
      let flag = true
      this.$refs['form'].validate(val => {
        flag = !val
      })
      if (flag) return false
      // 对比新密码与确认密码
      if (this.passwords.newOne.trim() !== this.passwords.newConfirm.trim()) {
        this.$message.warning('两次输入的新密码不一致！')
        return false
      }
      // 进行提交更改
      const data = {
        old: this.passwords.old.trim(),
        newOne: this.passwords.newOne.trim()
      }
      this.$store.dispatch('user/changePassword', data).then(async res => {
        this.$message.success('密码更新成功，请重新登录！')
        // 退出登录
        await this.$store.dispatch('user/logout')
        // 取消重定向
        this.$router.push(`/login`)
        // 清空固钉
        this.$store.state.tagsView.visitedViews = []
      })
    },
    // 重置表单
    resetForm() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.changePassword-box {
  .fr {
    float: right;
  }

  .mr10 {
    margin-right: 10px;
  }
}
</style>
