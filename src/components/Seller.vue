<template>
<div class="com-container"><div class="com-chart" ref="seller_ref"></div></div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  neme: 'Seller',
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: null
    }
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
  created () {
    // 在组建创建完成后来进行回调函数的注册
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
    this.$scoket.unRegisterCallBack('sellerData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      const initOption = {
        title: {
          text: '▍商家销售统计',
          top: 20,
          left: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离时包含坐标轴上文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2d3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052ee'
                }, {
                  offset: 1,
                  color: '#ab6ee5'
                }
              ])
            }
          }
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
    getData (res) {
      // const { data: res } = await this.$http.get('seller')
      this.allData = res
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updataChart()
      this.startInterval()
    },
    updataChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const shwoData = this.allData.slice(start, end)
      const sellerNames = shwoData.map((item) => {
        return item.name
      })
      const sellerValues = shwoData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updataChart()
      }, 3000)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      const adapterOptition = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOptition)
      this.chartInstance.resize()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
