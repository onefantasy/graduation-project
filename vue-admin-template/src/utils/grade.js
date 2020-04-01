/**
 *
 * @param {Array} rightArr
 * 1. 含有正确答案的问题数据
 * @param {Array} mineArr
 * 2. 考生根据试卷做出的回答
 *
 */
export function grading(rightArr, mineArr) {
  // 删除考生答案中每个数组的第一个元素，因为序号的问题，导致第一个元素其实不存在
  for (const key in mineArr) {
    mineArr[key].shift()
  }

  // 总得分
  const score = {
    scoreExam: 0,
    singlesExam: 0,
    multiplesExam: 0,
    judgesExam: 0,
    completionsExam: 0
  }
  // 回答记录的数组
  let answerArr = []
  // 不需要自动评分的题型
  const notGrade = ['essays']
  // 需要评分的题型
  const keys = Object.keys(rightArr).filter(item => {
    return notGrade.indexOf(item) === -1
  })

  for (let i = 0, l = keys.length; i < l; i++) {
    let res = ''
    switch (keys[i]) {
      case 'singles':
        res = grade(keys[i], rightArr, mineArr)
        break
      case 'multiples':
        res = grade(keys[i], rightArr, mineArr)
        break
      case 'judges':
        res = grade(keys[i], rightArr, mineArr)
        break
      case 'completions':
        res = grade(keys[i], rightArr, mineArr)
        break
      //   case 'essays':
      //     gradeEssay(rightArr, mineArr)
      //     break
      default:
        break
    }
    score.scoreExam += res.score
    score[keys[i] + 'Exam'] = res.score
    answerArr = answerArr.concat(res.arr)
  }

  // 将问答题也一起保存
  for (let i = 0, l = notGrade.length; i < l; i++) {
    const target = mineArr[notGrade[i]]
    for (let j = 0, size = target.length; j < size; j++) {
      // 删除掉是否正确的标志，否则存入数据库会报错
      delete target[j].isTrue
    }
    answerArr = answerArr.concat(target)
  }

  return { score, answerArr }
}

// 单选题评分
// 多选题评分
// 判断题评分
function grade(type, rightArr, mineArr) {
  // 答题记录的数组
  const res = { arr: [], score: 0 }
  const target = rightArr[type]
  mineArr[type].map(item => {
    for (let i = 0, l = target.length; i < l; i++) {
      if (item.qid === target[i].qid) {
        const flag = item.mineAnswer.trim() === target[i].rightKey.trim()
        // 答题是否正确
        item.isTrue = flag
        // 本题得分
        flag && (item.score = target[i].score)
        // 总计得分
        res.score += flag ? +target[i].score : 0
        // 保存记录
        res.arr.push(item)
        break
      }
    }
  })
  // 返回评分结果
  return res
}

// 填空题评分
// function gradeCompletions(rightArr, mineArr) {
//   const type = 'completions'
//   // 答题记录的数组
//   const res = {
//     arr: [],
//     score: 0
//   }
//   const target = rightArr[type]
//   mineArr[type].map(item => {
//     for (let i = 0, l = target.length; i < l; i++) {
//       if (item.qid === target[i].qid) {
//         break
//       }
//     }
//   })
//   // 返回评分结果
//   return res
// }
