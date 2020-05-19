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
    chartData: {
      type: Object,
      default() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    tooltipName: {
      type: String,
      default: '分数'
    },
    totalScore: {
      type: Number,
      default: 100
    }
  },
  watch: {
    'chartData': {
      handler() {
        this.$nextTick(() => {
          this.initChart()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 初始化图标
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['单选题', '多选题', '判断题', '填空题', '问答题', '总分']
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.chartData.name
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '分数',
            min: 0,
            max: this.totalScore,
            position: 'left',
            axisLine: {},
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '单选题',
            type: 'bar',
            data: this.chartData.singles
          },
          {
            name: '多选题',
            type: 'bar',
            data: this.chartData.multiples
          },
          {
            name: '判断题',
            type: 'bar',
            data: this.chartData.judges
          },
          {
            name: '填空题',
            type: 'bar',
            data: this.chartData.completions
          },
          {
            name: '问答题',
            type: 'bar',
            data: this.chartData.essays
          },
          {
            name: '总分',
            type: 'line',
            data: this.chartData.total
          }
        ]
      })
    }
  }
}
</script>

<style>

</style>
