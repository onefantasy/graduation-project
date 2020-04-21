const state = {
  // 中文序号
  chineseOrderNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
  // 题目配置
  question: {
    // 题型与对应的标志关系
    types: [
      { type: 'singles', name: '单选题' },
      { type: 'multiples', name: '多选题' },
      { type: 'judges', name: '判断题' },
      { type: 'completions', name: '填空题' },
      { type: 'essays', name: '问答题' }
    ],
    // 每个的题型的存储格式
    content: {
      singles: {
        score: '',
        content: '',
        A: '',
        B: '',
        C: '',
        D: '',
        rightKey: ''
      },
      multiples: {
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
      judges: {
        score: '',
        content: '',
        rightKey: ''
      },
      completions: {
        score: '',
        content: '',
        spaceNumber: '',
        rightKey: ''
      },
      essays: {
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
      'rightKey': '参考答案'
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
  judgeOptions: ['正确', '错误'],
  // 试卷发布状态
  publishState: [
    { label: '未发布', value: false },
    { label: '已发布', value: true }
  ],
  // 考试回答内容的存储格式
  answer: {
    // 试卷id
    paperId: '',
    // 试题id
    qid: '',
    // 考试者账号
    account: '',
    // 考试者的答案
    mineAnswer: '',
    // 回答是否正确
    isTrue: '',
    // 得分
    score: '',
    // 试题类型
    questionType: ''
  },
  // 默认头像
  defaultHeadIcon: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  // 身份
  roles: {
    'S': '学生',
    'T': '教师'
  },
  sexs: ['女', '男']
}

const mutations = {}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
