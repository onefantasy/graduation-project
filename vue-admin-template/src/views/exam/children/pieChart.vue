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
        return ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
      }
    },
    chartData: {
      type: Array,
      default() {
        return [320, 240, 149, 100, 59]
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
  data() {
    return {
      chart: null,

      // 渲染的数据
      showData: []
    }
  },
  watch: {
    'chartData': {
      handler() {
        this.formatData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.chartDataName
        },
        series: [
          {
            name: this.tooltipName,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.showData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    // 生成渲染格式的数据
    formatData() {
      for (let i = 0, l = this.chartDataName.length; i < l; i++) {
        this.showData.push({
          value: this.chartData[i],
          name: this.chartDataName[i]
        })
      }
    }
  }
}
</script>
