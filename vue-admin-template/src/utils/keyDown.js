import { Message } from 'element-ui'

// 屏蔽快捷键
export function hideKeyDown(event) {
  console.log('键盘按键；', event)
  // 禁止使用atl + → 或者atl + ← 进行前进后退网页
  if ((event.altKey) &&
      ((event.keyCode === 37) || // 屏蔽 Alt+ 方向键 ←
      (event.keyCode === 39))) { // 屏蔽 Alt+ 方向键 →
    Message({
      type: 'warning',
      message: '此页面禁止前进后退网页的操作！'
    })
    event.returnValue = false
  }
  // 禁止刷新页面
  if ((event.keyCode === 116) || // 屏蔽 F5 刷新键
      (event.keyCode === 112) || // 屏蔽 F1 刷新键
      (event.ctrlKey && event.keyCode === 82)) { // Ctrl + R
    Message({
      type: 'warning',
      message: '此页面禁止刷新该页面！'
    })
    event.returnValue = false
  }
  // 禁止使用ctrl + n 打开新页面
  if ((event.ctrlKey) && (event.keyCode === 78)) {
    Message({
      type: 'warning',
      message: '此页面禁止使用该快捷方式打开新窗口！'
    })
    event.returnValue = false
  }
  // 屏蔽alt + F4 关闭窗口
  if ((event.altKey) && (event.keyCode === 115)) {
    Message({
      type: 'warning',
      message: '此页面禁止使用该快捷方式关闭当前窗口！'
    })
    return false
  }
  // 屏蔽ctrl + w 关闭页面
  if (event.ctrlKey && event.keyCode === 87) {
    Message({
      type: 'warning',
      message: '此页面禁止关闭该页面！'
    })
    return false
  }
  // 禁用esc键
  if (event.keyCode === 27) {
    Message({
      type: 'warning',
      message: '此页面禁用esc键！'
    })
    event.keyCode = 0
    event.returnValue = false
    return false
  }
  // alt + tab切换窗口: 系统级快捷键，无法进行屏蔽
}
