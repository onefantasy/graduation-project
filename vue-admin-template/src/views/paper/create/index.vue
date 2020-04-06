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
          <el-input v-model.number="paper.totalScore" placeholder="请填写试卷总分" type="number" :min="0" />
        </el-form-item>

        <div class="flex-box">
          <el-form-item prop="singles" label="单选题数量" class="flex-item">
            <el-input v-model.number="paper.singles" placeholder="请填写单选题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="singlesScore" label="单选题总分" class="flex-item">
            <el-input v-model.number="paper.singlesScore" placeholder="请填写单选题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="multiples" label="多选题数量" class="flex-item">
            <el-input v-model.number="paper.multiples" placeholder="请填写多选题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="multiplesScore" label="多选题总分" class="flex-item">
            <el-input v-model.number="paper.multiplesScore" placeholder="请填写多选题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="judges" label="判断题数量" class="flex-item">
            <el-input v-model.number="paper.judges" placeholder="请填写判断题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="judgesScore" label="判断题总分" class="flex-item">
            <el-input v-model.number="paper.judgesScore" placeholder="请填写判断题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="completions" label="填空题数量" class="flex-item">
            <el-input v-model.number="paper.completions" placeholder="请填写填空题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="completionsScore" label="填空题总分" class="flex-item">
            <el-input v-model.number="paper.completionsScore" placeholder="请填写填空题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <div class="flex-box">
          <el-form-item prop="essays" label="问答题数量" class="flex-item">
            <el-input v-model.number="paper.essays" placeholder="请填写问答题数量" type="number" :min="0" />
          </el-form-item>

          <el-form-item prop="essaysScore" label="问答题总分" class="flex-item">
            <el-input v-model.number="paper.essaysScore" placeholder="请填写问答题总分" type="number" :min="0" />
          </el-form-item>
        </div>

        <el-form-item prop="text" label="试卷简介" class="flex-item">
          <el-input v-model="paper.text" placeholder="请填写试卷简介" type="textarea" autosize maxlength="400" show-word-limit />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-finished" type="primary" @click="createPaper">保存</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Create',
  components: {},
  data() {
    return {
      // 试卷信息
      paper: {
        paperTitle: '试卷标题', // 试卷标题
        subject: '试卷科目', // 试卷科目
        time: '02:30:00', // 考试时间
        startTime: '2020-03-25 09:05:05', // 考试开始时间
        endTime: '2020-03-28 09:05:05', // 考试结束时间
        totalScore: 0, // 总分
        singles: 0, // 单选题数量
        singlesScore: 0, // 单选题总分
        multiples: 0, // 多选题数量
        multiplesScore: 0, // 多选题总分
        judges: 0, // 判断题数量
        judgesScore: 0, // 判断题总分
        completions: 0, // 填空题数量
        completionsScore: 0, // 填空题总分
        essays: 0, // 问答题数量
        essaysScore: 0, // 问答题总分
        text: '试卷说明' // 试卷说明
      },

      // 表单验证
      rules: {
        paperTitle: [{ required: true, message: '请填写试卷标题', tigger: 'blur' }],
        subject: [{ required: true, message: '请填写试卷科目', tigger: 'blur' }],
        time: [{ required: true, message: '请选择考试用时', tigger: 'blur' }],
        startTime: [{ required: true, message: '请填写考试开始时间', tigger: 'blur' }],
        endTime: [{ required: true, message: '请填写考试结束时间', tigger: 'blur' }],
        totalScore: [{ required: true, type: 'number', message: '请填写试卷总分', tigger: 'blur' }],
        singles: [{ required: true, type: 'number', message: '请填写单选题数量', tigger: 'blur' }],
        singlesScore: [{ required: true, type: 'number', message: '请填写单选题总分', tigger: 'blur' }],
        multiples: [{ required: true, type: 'number', message: '请填写多选题数量', tigger: 'blur' }],
        multiplesScore: [{ required: true, type: 'number', message: '请填写多选题总分', tigger: 'blur' }],
        judges: [{ required: true, type: 'number', message: '请填写判断题数量', tigger: 'blur' }],
        judgesScore: [{ required: true, type: 'number', message: '请填写判断题总分', tigger: 'blur' }],
        completions: [{ required: true, type: 'number', message: '请填写填空题数量', tigger: 'blur' }],
        completionsScore: [{ required: true, type: 'number', message: '请填写填空题总分', tigger: 'blur' }],
        essays: [{ required: true, type: 'number', message: '请填写问答题数量', tigger: 'blur' }],
        essaysScore: [{ required: true, type: 'number', message: '请填写问答题总分', tigger: 'blur' }],
        text: [{ required: true, message: '请填写试卷说明', tigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    // 如果存在试卷id，则请求试卷信息进行修改
    this.getPaperInfo(this.$route.query.code)
  },
  methods: {
    // 获取试卷信息
    getPaperInfo(id) {
      if (!id) return false
      const params = {
        paperId: id
      }
      // 发起请求
      this.$store.dispatch('paper/getPaperDetail', params).then(res => {
        this.paper = res.data.config
      }).catch(() => {})
    },
    // 创建试卷
    createPaper() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.dispatch('paper/createPaper', this.paper).then(res => {
            this.$message({
              message: '试卷保存成功',
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
