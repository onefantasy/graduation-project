<template>
  <div class="changeHeadIcon-box">
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :action="action"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="changeImg"
      :headers="headers"
      :data="params"
      :on-success="uploadSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
    </el-upload>
    <div class="change-button">
      <el-button type="primary" @click="submitHeadIcon">更改头像</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangeHeadIcon',
  components: {},
  data() {
    return {
      // 头像地址
      imageUrl: '',

      // 上传头像时，额外附带的参数
      params: {
        type: 'headIcon'
      }
    }
  },
  computed: {
    // 图片上传的地址
    action() {
      return process.env.VUE_APP_BASE_API + 'image/saveHeadIcon'
    },
    // 上传图片时携带的 token
    headers() {
      return { 'x-token': this.$store.getters.token }
    }
  },
  methods: {
    // 更改头像时的回调
    changeImg(file, fileList) {
      fileList.length = 0
      fileList.push(file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 点击确认更换头像按钮
    submitHeadIcon() {
      this.$refs['upload'].submit()
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      if (response.code === 20000) {
        this.$message({
          message: '头像更改成功',
          type: 'success'
        })
        this.$refs['upload'].clearFiles()
        this.imageUrl = ''
      }
      this.$store.dispatch('user/getInfo')
    },
    // 上传头像前的检验
    beforeAvatarUpload(file) {
      const is5M = file.size / 1024 / 1024 < 5
      const suffixs = ['image/jpeg', 'image/png']
      const isSuffix = suffixs.indexOf(file.type) !== -1
      if (!is5M) this.$message.error('图片大小不得超过5M!')
      if (!isSuffix) this.$message.error('图片格式只支持' + suffixs.join(','))
      return is5M && isSuffix
    }
  }
}
</script>

<style lang="scss">
.changeHeadIcon-box {
  .avatar-uploader {
    width: 200px;
    margin: 50px auto;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
}
</style>

<style lang="scss" scoped>
.change-button{
  width: 100px;
  margin: 0 auto;
}
</style>
