<template>
  <div class="register-box">
    <el-form
      ref="registerForm"
      :model="userInfo"
      :rules="rules"
      label-width="80"
      label-position="right"
    >
      <el-scrollbar class="register-scrollbar">
        <el-form-item label="账号" prop="account">
          <el-input v-model="userInfo.account" placeholder="请输入您的账号(建议使用学号)" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" placeholder="请输入您的姓名(建议使用真实姓名)" />
        </el-form-item>
        <el-form-item label="身份" prop="role">
          <el-select v-model="userInfo.role" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="userInfo.school" placeholder="请输入您的学校" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="userInfo.major" placeholder="请输入您的专业" />
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="userInfo.class" placeholder="请输入您的班级" />
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model="userInfo.number" placeholder="请输入您的学号" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userInfo.age" placeholder="请输入您的年龄" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="userInfo.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password" placeholder="请输入密码" type="password" />
        </el-form-item>
      </el-scrollbar>
      <div class="form-button">
        <el-button type="primary" @click="submitForm">注册</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  components: {},
  data() {
    return {
      // 用户信息
      userInfo: {
        account: '', // 用户账号
        name: '', // 用户姓名
        role: '', // 用户身份
        school: '', // 学校
        major: '', // 专业
        class: '', // 班级
        number: '', // 学号
        age: '', // 年龄
        sex: '', // 性别
        password: '' // 密码
      },

      // 表单验证
      rules: {
        account: [{ required: true, message: '请输入账号', tigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', tigger: 'blur' }],
        role: [{ required: true, message: '请选择职业', tigger: 'blur' }],
        school: [{ required: true, message: '请输入学校', tigger: 'blur' }],
        major: [{ required: true, message: '请输入专业', tigger: 'blur' }],
        class: [{ required: true, message: '请输入班级', tigger: 'blur' }],
        number: [{ required: true, message: '请输入学号', tigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', tigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', tigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', tigger: 'blur' }]
      },

      // 身份选项
      roleOptions: [
        { value: 'T', label: '教师' },
        { value: 'S', label: '学生' }
      ],

      // 性别选项
      sexOptions: [
        { value: '0', label: '女' },
        { value: '1', label: '男' }
      ]
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.$refs['registerForm'].resetFields()
    },
    // 提交表单
    submitForm() {
      // 对表单进行校验
      this.$refs['registerForm'].validate()
        .then(result => {
          //  通过验证
          return this.$store.dispatch('user/register', this.userInfo)
        })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '注册成功，快去登录吧',
              type: 'success'
            })
            // 重置表单
            this.$refs['registerForm'].resetFields()
            this.$emit('registerSuccess')
          }
        })
        .catch(err => {
          if (err !== false) return false
          // 没通过验证的提示
          this.$message({
            message: '请先将表单填写完整再提交',
            type: 'warning'
          })
        })
    }
  }
}
</script>

<style lang="scss">
  .register-box{
    .el-form-item__label{
      line-height: 50px;
      padding-left: 12px;
    }

    .el-input__inner{
      color: #666 !important;
      caret-color: #666 !important;
    }

    .el-select{
      width: calc(100% - 80px);
    }

    .register-scrollbar{
      >.el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }
</style>

<style scoped lang="scss">
  .register-scrollbar{
    height: 400px;
  }
  .form-button{
    padding-top: 10px;
  }
</style>
