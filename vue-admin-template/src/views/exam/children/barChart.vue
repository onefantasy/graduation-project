<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartDataName: {
      type: Array,
      default() {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    },
    chartData: {
      type: Array,
      default() {
        return [120, 200, 150, 80, 70, 110, 130]
      }
    },
    title: {
      type: String,
      default: ''
    },
    tooltipName: {
      type: String,
      default: '数据'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    // 初始化图标
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: this.title
        },
        yAxis: {
          type: 'category',
          data: this.chartDataName,
          name: '题型'
        },
        xAxis: {
          type: 'value',
          name: '平均分'
        },
        series: [
          {
            name: this.tooltipName,
            data: this.chartData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>

<style>

</style>
