<template>
  <div class="create-paper-box">
    <el-card shadow="always">
      <div slot="header">
        <span>创建试卷</span>
      </div>

      <el-form
        ref="form"
        :model="paper"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="paperTitle" label="试卷名称">
          <el-input v-model="paper.paperTitle" placeholder="请填写试卷名称" />
        </el-form-item>

        <el-form-item prop="subject" label="试卷科目">
          <el-input v-model="paper.subject" placeholder="请填写试卷科目" />
        </el-form-item>

        <div class="flex-box">
          <el-form-item prop="time" label="考试用时" class="flex-item">
            <el-time-picker
              v-model="paper.time"
              value-format="HH:mm:ss"
              placeholder="请设定考试时间"
            />
          </el-form-item>

          <el-form-item prop="startTime" label="开始时间" class="flex-item">
            <el-date-picker
              v-model="paper.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>

          <el-form-item prop="endTime" label="结束时间" class="flex-item">
            <el-date-picker
              v-model="paper.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </div>

        <el-form-item prop="totalScore" label="试卷总分">
          <el-input v-model="paper.totalScore" placeholder="请填写试卷总分" type="number" :min="0" />
        </el-form-item>

        <div class="flex-box">
          <el-form-item prop="single" label="单选题数量" class="flex-item">
            <el-input v-model="paper.single" placeholder="请填写单选题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="singleScore" label="单选题总分" class="flex-item">
            <el-input v-model="paper.singleScore" placeholder="请填写单选题总分" type="number" :min="0" :max="20" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="multiple" label="多选题数量" class="flex-item">
            <el-input v-model="paper.multiple" placeholder="请填写多选题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="multipleScore" label="多选题总分" class="flex-item">
            <el-input v-model="paper.multipleScore" placeholder="请填写多选题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="judge" label="判断题数量" class="flex-item">
            <el-input v-model="paper.judge" placeholder="请填写判断题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="judgeScore" label="判断题总分" class="flex-item">
            <el-input v-model="paper.judgeScore" placeholder="请填写判断题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="completion" label="填空题数量" class="flex-item">
            <el-input v-model="paper.completion" placeholder="请填写填空题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="completionScore" label="填空题总分" class="flex-item">
            <el-input v-model="paper.completionScore" placeholder="请填写填空题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="essay" label="问答题数量" class="flex-item">
            <el-input v-model="paper.essay" placeholder="请填写问答题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="essayScore" label="问答题总分" class="flex-item">
            <el-input v-model="paper.essayScore" placeholder="请填写问答题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <el-form-item prop="text" label="试卷简介" class="flex-item">
          <el-input v-model="paper.text" placeholder="请填写试卷简介" type="textarea" autosize maxlength="200" show-word-limit />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="createPaper">创建</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 试卷信息
      paper: {
        paperTitle: '试卷标题', // 试卷标题
        subject: '试卷科目', // 试卷科目
        time: '', // 考试时间
        startTime: '', // 考试开始时间
        endTime: '', // 考试结束时间
        totalScore: '150', // 总分
        single: '10', // 单选题数量
        singleScore: '0', // 单选题总分
        multiple: '0', // 多选题数量
        multipleScore: '0', // 多选题总分
        judge: '10', // 判断题数量
        judgeScore: '0', // 判断题总分
        completion: '3', // 填空题数量
        completionScore: '0', // 填空题总分
        essay: '5', // 问答题数量
        essayScore: '0', // 问答题总分
        text: '试卷说明' // 试卷说明
      },

      // 表单验证
      rules: {
        paperTitle: [{ required: true, message: '请填写试卷标题', tigger: 'blur' }],
        subject: [{ required: true, message: '请填写试卷科目', tigger: 'blur' }],
        time: [{ required: true, message: '请选择考试用时', tigger: 'blur' }],
        startTime: [{ required: true, message: '请填写考试开始时间', tigger: 'blur' }],
        endTime: [{ required: true, message: '请填写考试结束时间', tigger: 'blur' }],
        totalScore: [{ required: true, message: '请填写试卷总分', tigger: 'blur' }],
        single: [{ required: true, message: '请填写单选题数量', tigger: 'blur' }],
        singleScore: [{ required: true, message: '请填写单选题总分', tigger: 'blur' }],
        multiple: [{ required: true, message: '请填写多选题数量', tigger: 'blur' }],
        multipleScore: [{ required: true, message: '请填写多选题总分', tigger: 'blur' }],
        judge: [{ required: true, message: '请填写判断题数量', tigger: 'blur' }],
        judgeScore: [{ required: true, message: '请填写判断题总分', tigger: 'blur' }],
        completion: [{ required: true, message: '请填写填空题数量', tigger: 'blur' }],
        completionScore: [{ required: true, message: '请填写填空题总分', tigger: 'blur' }],
        essay: [{ required: true, message: '请填写问答题数量', tigger: 'blur' }],
        essayScore: [{ required: true, message: '请填写问答题总分', tigger: 'blur' }],
        text: [{ required: true, message: '请填写试卷说明', tigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  methods: {
    // 创建试卷
    createPaper() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.dispatch('paper/createPaper', this.paper).then(res => {
            this.$message({
              message: '试卷创建成功',
              type: 'success'
            })
            this.resetForm()
          })
        } else {
          this.$message({
            message: '请先填写完整在进行提交',
            type: 'warning'
          })
        }
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
.create-paper-box{
  padding: 20px;

  .flex-box{
    display: flex;

    .flex-item{
        flex: 1;
    }
  }

  .fr {
    float: right;
  }
}
</style>
