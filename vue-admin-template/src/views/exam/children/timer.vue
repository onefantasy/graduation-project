<template>
  <div class="timer-box">
    <!-- 进度表 开始 -->
    <div class="time" :class="{ tip: seconds <= tipTime }">{{ formatTime(seconds) }}</div>
    <!-- 进度表 结束 -->
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    time: {
      type: String,
      default: '00:00:00'
    }
  },
  data() {
    return {
      // 进度值
      percentage: 10,
      // 不同进度的颜色
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],

      // 全部时间
      allTime: 0,

      // 倒计时的毫秒数
      seconds: 0,

      // 提示时间
      tipTime: 0,

      // 计时器
      timer: null
    }
  },
  created() {
    // 接收父组件传入的时间
    this.initSecond()
    // 开始计时
    this.timing()
  },
  beforeDestroy() {
    // 关闭计时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 初始化倒计时的数
    initSecond() {
      const arr = this.time.split(':')
      this.seconds = (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2])
      this.allTime = this.seconds
      this.tipTime = this.seconds * 0.20
    },
    // 将秒数转化为时，分，秒
    formatTime(seconds) {
      const arr = []
      arr[0] = parseInt(seconds / 3600)
      arr[1] = parseInt((seconds - arr[0] * 3600) / 60)
      arr[2] = seconds % 60
      for (let i = 0; i < arr.length; i++) {
        arr[i] > 9 || (arr[i] = '0' + arr[i])
      }
      return arr.join(':')
    },
    // 开启计时器
    timing() {
      this.timer = setInterval(() => {
        if (!this.seconds && this.timer) {
          // 清除定时器
          clearInterval(this.timer)
          // 通知父组件已经计时完毕
          this.$emit('timeout')
        } else {
          this.seconds--
        }
      }, 1000)
    },
    // 获取已经经过的时间
    getUsedTime() {
      return this.formatTime(this.allTime - this.seconds + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.timer-box {
  .time {
    font-family: 'KaiTi';
    font-size: 20px;
    padding: 8px;
  }

  .tip {
    color: red;
  }
}
</style>
