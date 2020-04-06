<template>
  <div class="question">
    <div v-if="issue.content">
      <!-- 题目 开始 -->
      <div v-html="issue.content" />
      <!-- 题目 结束 -->
      <!-- 选择题选项 开始 -->
      <div v-if="issue[selectOptions[0]]">
        <div v-for="item in selectOptions" :key="item" class="flex-box">
          <div v-if="issue[item]" style="line-height: 50px;">{{ item }}、</div>
          <div v-if="issue[item]" v-html="issue[item]" />
        </div>
      </div>
      <!-- 选择题选项 结束 -->
      <!-- 答题 开始 -->
      <div class="flex-box">
        <div style="line-height: 40px; width: 50px;">
          <strong>答案：</strong>
        </div>
        <!-- 单选题选项 开始 -->
        <div v-if="type === questionTypes[0].type">
          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio-button v-for="item in choiceOptions" :key="item" :label="item" />
          </el-radio-group>
        </div>
        <!-- 单选题选项 结束 -->
        <!-- 多选题选项 开始 -->
        <div v-else-if="type === questionTypes[1].type">
          <el-checkbox-group v-model="checkboxGroup" @change="changeCheckbox">
            <el-checkbox-button v-for="item in choiceOptions" :key="item" :label="item">{{ item }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <!-- 多选题选项 结束 -->
        <!-- 判断题选项 开始-->
        <div v-else-if="type === questionTypes[2].type">
          <el-radio-group v-model="judge" @change="changeJudge">
            <el-radio-button v-for="item in judgeOptions" :key="item" :label="item" />
          </el-radio-group>
        </div>
        <!-- 判断题选项 结束-->
        <!-- 填空题 开始 -->
        <div v-else-if="type === questionTypes[3].type">
          <el-input v-for="item in issue.spaceNumber" :key="item" v-model="completions[item - 1]" style="margin-bottom: 5px;" @input="changeCompletion" />
        </div>
        <!-- 填空题 结束 -->
        <!-- 问答题 开始 -->
        <div v-else style="flex: 1">
          <el-input v-model="textarea" type="textarea" autosize @input="changeTextarea" />
        </div>
        <!-- 问答题 结束 -->
      </div>
      <!-- 答题 结束 -->
    </div>
    <div v-else>暂无该题，请联系出卷人</div>
  </div>
</template>

<script>
export default {
  props: {
    issue: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 1
    },
    answers: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 选择题选项
      selectOptions: [],

      // 单选题选项
      singleOptions: [],

      // 判断题选项
      judgeOptions: [],

      // 所有题型
      questionTypes: [],

      // 单选题答案
      radio: '',

      // 多选题答案
      checkboxGroup: [],

      // 判断题答案
      judge: '',

      // 填空题答案
      completions: [],

      // 问答题答案
      textarea: ''
    }
  },
  computed: {
    // 选择题选项
    choiceOptions() {
      return this.selectOptions.filter(item => {
        return this.issue[item]
      })
    }
  },
  watch: {
    'issue': {
      handler() {
        this.radio = ''
        this.checkboxGroup = []
        this.judge = ''
        this.completions = []
        this.textarea = ''
        if (this.type === this.questionTypes[0].type) {
          this.radio = this.answers[this.type][this.index].mineAnswer
        } else if (this.type === this.questionTypes[1].type) {
          this.checkboxGroup = this.answers[this.type][this.index].mineAnswer.split('')
        } else if (this.type === this.questionTypes[2].type) {
          this.judge = this.answers[this.type][this.index].mineAnswer
        } else if (this.type === this.questionTypes[3].type) {
          this.completions = this.answers[this.type][this.index].mineAnswer.split(' ')
        } else {
          this.textarea = this.answers[this.type][this.index].mineAnswer
        }
      },
      deep: true
    }
  },
  created() {
    // 从仓库获取选择题选项
    this.selectOptions = this.$store.getters.constant.selectOptions
    // 从残酷获取判断题选项
    this.judgeOptions = this.$store.getters.constant.judgeOptions
    // 从仓库获取所有的题型
    this.questionTypes = this.$store.getters.constant.question.types
  },
  methods: {
    // 单选 选择事件
    changeRadio(e) {
      this.answers[this.type][this.index].mineAnswer = e
    },
    // 多选 选择事件
    changeCheckbox(e) {
      this.answers[this.type][this.index].mineAnswer = e.sort().join('')
    },
    // 判断题答案
    changeJudge(e) {
      this.answers[this.type][this.index].mineAnswer = e
    },
    // 填空题答案
    changeCompletion() {
      this.answers[this.type][this.index].mineAnswer = this.completions.map(item => item.trim()).join(' ')
    },
    // 问答题答案
    changeTextarea(e) {
      this.answers[this.type][this.index].mineAnswer = e.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
    }
  }
}
</script>

<style lang="scss" scoped>
.question {
  .flex-box {
    display: flex;

    p {
      margin-block-start: 0;
      margin-block-end: 0;
    }
  }
}
</style>
