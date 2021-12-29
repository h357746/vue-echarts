<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" :style="comStyle" @click="toLeft">&#xe6ef;</span
    ><span class="iconfont arr-right" :style="comStyle" @click="toRight" >&#xe6ed;</span>
    <span class="title" :style="comStyle">{{title}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  neme: 'Hot',
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      currentIndex: 0, // 当前展示的一级分类
      titleFontSize: 0
    }
  },
  created () {
    // 在组建创建完成后来进行回调函数的注册
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted () {
    this.initChart() // 调用初始化图表方法
    // this.getData() // 调用获取数据
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter) // 事件s监听
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$scoket.unRegisterCallBack('hotData')
  },
  computed: {
    title () {
      if (!this.allData) {
        return ''
      } else { return this.allData[this.currentIndex].name }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
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
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '▍热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        tooltip: {
          // 自定义工具提示格式
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `${item.name}： ${parseInt(item.value / total * 100)}%<br />`
            })
            return retStr
          }
        },
        legend: {
          top: '15%',
          icon: 'cricle'
        },
        series: {
          type: 'pie',
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true
            },
            labelLine: {
              show: false
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    getData (res) {
      // const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      this.updataChart()
    },
    // 处理数据
    updataChart () {
      // 处理数据
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        }
      )
      // 类目轴数据
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name
        }
      )
      // 图例数据

      const dataOption = {
        legend: {
          data: legendData
        },
        series: {
          data: seriesData
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOptition = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOptition)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updataChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updataChart()
    }
  }
}
</script>
<style lang="less" scoped>
.arr-left {
  position: absolute;
  top: 60%;
  left: 10%;
  transform: translate(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  top: 60%;
  right: 10%;
  transform: translate(-50%);
  cursor: pointer;
  color: white;
}
.title{
    position: absolute;
    left: 80%;
    bottom: 20px;
    color: white;
}
</style>
