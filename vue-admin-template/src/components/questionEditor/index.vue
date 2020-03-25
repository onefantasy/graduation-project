<template>
  <div class="addQuestion-box">
    <el-form ref="form" :model="question" :rules="rules" label-width="80px">

      <!-- 选择题型 开始 -->
      <el-form-item label="题型">
        <el-select v-model="question.type" placeholder="请选择" :disabled="!!questionInfo.type" @change="changeType">
          <el-option
            v-for="item in questionTypes"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <!-- 选择提醒 结束 -->

      <!-- 主要输入内容区域 开始 -->
      <div v-if="question.content">
        <el-form-item v-for="(item, index) of question.content" :key="index" :label="fieldTip[index]" :prop="'content.' + index">
          <editor
            v-if="useEditor.indexOf(index) !== -1"
            :obj="question.content"
            :key-word="index"
            :refresh="refreshFlag"
          />
          <el-radio-group v-else-if="question.type === 'judge' && index === 'rightKey'" v-model="question.content[index]">
            <el-radio-button v-for="unit of judgeOptions" :key="unit" :label="unit" />
          </el-radio-group>
          <el-input v-else-if="numberField.indexOf(index) !== -1" v-model.number="question.content[index]" type="number" />
          <el-input v-else v-model="question.content[index]" />
        </el-form-item>
      </div>
      <!-- 主要输入内容区域 结束 -->

      <!-- 保存按钮 开始 -->
      <el-form-item>
        <el-button type="primary" style="width: 100%;" @click="save">保存</el-button>
      </el-form-item>
      <!-- 保存按钮 结束 -->
    </el-form>
  </div>
</template>

<script>
import editor from '@/components/editor'
export default {
  components: {
    editor
  },
  props: {
    /*
     * 该值接收父组件传来的试题信息（{ type, content }）
     * type 为试题类型，如果存在，则禁止更改试题类型
     * content 为试题的存储内容
    */
    questionInfo: {
      type: Object,
      default() {
        return {
          type: 'single',
          content: {}
        }
      }
    }
  },
  data() {
    return {
      // 各种题目类型的存储格式
      questionContent: {},

      // 所有的试题类型
      questionTypes: [],

      // 题目的存储内容格式
      question: {
        type: 'single', // 试题类型
        content: {} // 试题内容
      },

      // 获取判断题选项
      judgeOptions: [],

      // 存储字段与对应的提示
      fieldTip: {},

      // 需要使用富文本的项
      useEditor: ['content', 'A', 'B', 'C', 'D', 'E', 'F'],

      // 需要数字类型验证的字段
      numberField: ['score', 'spaceNumber'],

      // 表单验证规则
      rules: {
        type: [{ required: true, message: '请选择题目类型', tigger: 'blur' }],
        'content.content': [{ required: true, message: '请填写题目内容', tigger: 'blur' }],
        'content.score': [{ required: true, type: 'number', message: '请填写该题分数', tigger: 'blur' }],
        'content.A': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.B': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.C': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.D': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.E': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.F': [{ required: true, message: '请填写该选项的内容', tigger: 'blur' }],
        'content.spaceNumber': [{ required: true, type: 'number', message: '请填写该填空题的空格数', tigger: 'blur' }],
        'content.rightKey': [{ required: true, message: '请填写正确答案', tigger: 'blur' }]
      },

      // 本次题目所属的类型
      state: '',

      // 重置富文本中内容
      refreshFlag: false
    }
  },
  created() {
    // 从仓库获取所有题目类型的存储格式
    this.questionContent = JSON.parse(JSON.stringify(this.$store.getters.constant.question.content))
    // 从仓库获取所有的试题类型
    this.questionTypes = this.$store.getters.constant.question.types
    // 初始化题目的存储内容
    this.question.content = JSON.parse(JSON.stringify(this.questionContent[this.question.type]))
    // 从仓库获取所有的题目字段与对应的提示
    this.fieldTip = this.$store.getters.constant.question.fieldTip
    // 获取判断题选项
    this.judgeOptions = this.$store.getters.constant.judgeOptions
  },
  methods: {
    // 改变题目类型时，更改试题存储格式
    changeType(e) {
      this.question.content = JSON.parse(JSON.stringify(this.questionContent[this.question.type]))
    },
    // 保存
    save() {
      this.question.content.state = this.$store.getters.constant.question.state.collection
      this.$store.dispatch('question/saveQuestion', this.question).then(res => {
        this.$message.success(res.message)
        delete this.question.content.state
        this.$refs['form'].resetFields()
        this.refreshFlag = !this.refreshFlag
      }).catch(() => {
        delete this.question.content.state
      })
    },
    // 获取已填写的试题信息（主要给父组件使用）
    getQuestionInfo() {
      return this.question.content
    }
  }
}
</script>

<style lang="scss">
.addQuestion-box {
  .el-form-item__content {
    line-height: normal;
  }
}
</style>

<style lang="scss" scoped>
.addQuestion-box {
  padding: 20px;
}
</style>
