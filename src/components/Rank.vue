<template>
<div class="com-container">
  <div class="com-chart" ref="rank_ref"></div></div>
</template>

<script>
export default {
  neme: 'Rank',
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的重点值
      timerId: null

    }
  },
  mounted () {
    this.initChart() // 调用初始化图表方法
    this.getData() // 调用获取数据
    window.addEventListener('resize', this.screenAdapter) // 事件s监听
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化echarts
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '▍地区销售排行',
          top: 20,
          left: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          { type: 'bar' }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('rank')
      this.allData = res
      // 从大到小排序
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
      this.startInterval()
    },
    // 处理数据
    updataChart () {
      // 定义颜色数组
      const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5']
      ]
      // 处理数据
      // 类目轴数据
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      const valueArr = this.allData.map(item => {
        return item.value
      })
      // 图例数据

      const dataOption = {
        xAxis: { data: provinceArr },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [{
          data: valueArr,
          itemStyle: {
            color: arg => {
              let targerColorArr = null
              if (arg.value > 300) {
                targerColorArr = colorArr[0]
              } else if (arg.value > 200) {
                targerColorArr = colorArr[1]
              } else {
                targerColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: targerColorArr[0] }, { offset: 1, color: targerColorArr[1] }
              ])
            }
          }
        }]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOptition = {
        title: {
          textStyle: {
            fonSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOptition)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updataChart()
      }, 2000)
    }
  }

}
</script>
<style lang="less" scoped>

</style>
