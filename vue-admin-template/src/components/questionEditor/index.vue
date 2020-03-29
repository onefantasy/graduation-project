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
          <quill-editor
            v-if="useEditor.indexOf(index) !== -1"
            v-model="question.content[index]"
          />
          <el-radio-group v-else-if="question.type === 'judges' && index === 'rightKey'" v-model="question.content[index]">
            <el-radio-button v-for="unit of judgeOptions" :key="unit" :label="unit" />
          </el-radio-group>
          <el-input v-else-if="numberField.indexOf(index) !== -1" v-model.number="question.content[index]" type="number" />
          <el-input v-else v-model="question.content[index]" />
        </el-form-item>
      </div>
      <!-- 主要输入内容区域 结束 -->

      <!-- 正确答案的填写格式 开始 -->
      <el-form-item>
        正确答案格式：<br>
        1. 答案的前后注意不要有空格<br>
        2. 单选题请在输入框中输入唯一到正确答案，如：A<br>
        3. 多选题请将答案依次写在输入框中，每个答案之间不要有空格或者他符号，如：ABCD<br>
        4. 判断题请选择正确答案即可<br>
        5. 填空题中，每个答案请用空格隔开，如：A B C<br>
        6. 问答题只需将答案写在输入框中即可，没有特殊要求<br>
      </el-form-item>
      <!-- 正确答案的填写格式 结束  -->

      <!-- 保存按钮 开始 -->
      <el-form-item v-if="!questionInfo.type">
        <el-button icon="el-icon-finished" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-refresh-left" @click="changeType">重置</el-button>
      </el-form-item>
      <!-- 保存按钮 结束 -->
    </el-form>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 各种题目类型的存储格式
      questionContent: {},

      // 所有的试题类型
      questionTypes: [],

      // 题目的存储内容格式
      question: {
        type: '', // 试题类型
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

      // 当前编辑的内容是否已经保存
      isSaved: false,

      // 父组件控制该组件的参数
      /*
       * 该值接收父组件传来的试题信息（{ type, content }）
       * type 为试题类型，如果存在，则禁止更改试题类型
       * content 为试题的存储内容
      */
      questionInfo: {
        type: '',
        content: {}
      }
    }
  },
  created() {
    // 从仓库获取所有题目类型的存储格式
    this.questionContent = JSON.parse(JSON.stringify(this.$store.getters.constant.question.content))
    // 从仓库获取所有的试题类型
    this.questionTypes = this.$store.getters.constant.question.types
    // 初始化题目的存储内容
    this.question.type = this.questionTypes[0].type
    this.question.content = JSON.parse(JSON.stringify(this.questionContent[this.question.type]))
    // 从仓库获取所有的题目字段与对应的提示
    this.fieldTip = this.$store.getters.constant.question.fieldTip
    // 获取判断题选项
    this.judgeOptions = this.$store.getters.constant.judgeOptions
  },
  methods: {
    // 改变题目类型时，更改试题存储格式
    changeType(e) {
      this.$refs['form'].resetFields()
      this.question.content = JSON.parse(JSON.stringify(this.questionContent[this.question.type]))
    },
    // 保存
    save() {
      let flag = true
      this.$refs['form'].validate(valid => {
        flag = valid
      })
      if (!flag) {
        this.$message.warning('请先将试题信息完善再进行提交！')
        return false
      }
      this.question.content.state = this.$store.getters.constant.question.state.collection
      this.$store.dispatch('question/saveQuestion', this.question).then(res => {
        this.$message.success(res.message)
        delete this.question.content.state
        this.$refs['form'].resetFields()
      }).catch(() => {
        delete this.question.content.state
      })
    },
    // 获取已填写的试题信息（主要给父组件使用）
    getQuestionInfo() {
      // 调用该函数时，表示试题信息已经保存
      this.isSaved = true
      return this.question.content
    },
    // 判断当前编辑的内容是否需要保存或者是否一境保存（主要给父组件使用）
    isNeedSave() {
      if (this.isSaved) return false
      const content = this.question.content
      const arrKeys = Object.keys(content)
      for (let i = 0; i < arrKeys.length; i++) {
        if (content[arrKeys[i]]) return true
      }
      return false
    },
    // 父组件更改子组件的存储格式以及存储类型(主要给父组件使用)
    changeQuestionInfo(newValue) {
      // 更改当前 是否已经保存 的标志的值
      this.isSaved = false
      // 重置输入的内容
      this.$refs['form'].resetFields()
      // 更新存储格式
      this.question.type = newValue.type
      this.changeType(newValue)
      this.questionInfo = newValue
      const arr = Object.keys(this.question.content)
      arr.map(item => {
        this.question.content[item] = newValue.content[item] || ''
      })
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
