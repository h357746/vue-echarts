<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  neme: 'Stock',
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      currentIndex: 0, // 当前显示数据的椰树
      timerId: null,
      titleFontSize: 0
    }
  },
  created () {
    // 在组建创建完成后来进行回调函数的注册
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    this.initChart() // 调用初始化图表方法
    // this.getData() // 调用获取数据
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter) // 事件s监听
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$scoket.unRegisterCallBack('stockData')
  },
  computed: {

    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前图表
      this.initChart() // 重新初始化图表
      this.screenAdapter() // 完成屏幕适配
      this.updataChart() // 更新数据
    }
  },
  methods: {
    // 初始化echarts
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▍库存和销量分析',
          left: 20,
          top: 20
        }
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
    getData (res) {
      // const { data: res } = await this.$http.get('stock')
      this.allData = res
      console.log(res)
      this.updataChart()
      this.startInterval()
    },
    // 处理数据
    updataChart () {
      // 处理数据
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: colorArr[index][0] },
                  { offset: 1, color: colorArr[index][1] }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      // 类目轴数据

      // 图例数据

      const dataOption = {
        series: seriesArr
      }
      console.log(dataOption)
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      this.titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6
      const innerRadius = this.titleFontSize * 3.2
      const outterRadius = innerRadius * 1.125
      const adapterOptition = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize
            }
          }, {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize
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
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updataChart()
      }, 4000)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
