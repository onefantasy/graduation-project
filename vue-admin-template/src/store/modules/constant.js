const state = {
  // 中文序号
  chineseOrderNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
  // 题目的同一配置
  question: {
    // 题型与对应的标志关系
    types: [
      { type: 'single', name: '单选题' },
      { type: 'multiple', name: '多选题' },
      { type: 'judge', name: '判断题' },
      { type: 'completion', name: '填空题' },
      { type: 'essay', name: '问答题' }
    ],
    // 每个的题型的存储内容
    content: {
      single: {
        score: '',
        content: '',
        A: '',
        B: '',
        C: '',
        D: '',
        rightKey: ''
      },
      multiple: {
        score: '',
        content: '',
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        rightKey: ''
      },
      judge: {
        score: '',
        content: '',
        rightKey: ''
      },
      completion: {
        score: '',
        content: '',
        spaceNumber: '',
        rightKey: ''
      },
      essay: {
        score: '',
        content: '',
        rightKey: ''
      }
    },
    // 题目存储字段与对应的提示
    fieldTip: {
      'score': '分值',
      'content': '题目',
      'A': 'A',
      'B': 'B',
      'C': 'C',
      'D': 'D',
      'E': 'E',
      'F': 'F',
      'spaceNumber': '空格数',
      'rightKey': '正确答案'
    },
    // 题目所属状态（类型：题库，错题）
    state: {
      collection: 'collection',
      wrong: 'wrong'
    }
  },
  // 选择题选项
  selectOptions: ['A', 'B', 'C', 'D', 'E', 'F'],
  // 判断题选项
  judgeOptions: ['正确', '错误']
}

const mutations = {}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
