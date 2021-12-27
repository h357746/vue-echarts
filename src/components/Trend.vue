<template>
<div class="com-container">
  <div class="title" :style="comSytle"><span >▍  {{showTitle}}</span>
  <span class="iconfont title-icon" :style="comSytle" @click="showChoice = !showChoice">&#xe6eb;</span>
  <div class="select-con" v-show="showChoice">
    <div class="select-item" :style="marginSytle" v-for="item in selectTypes" :key="item.key" @click="hanlderSelect(item.key)">{{item.text}}</div>
</div></div>
  <div class="com-chart" ref="trend_ref"></div></div>
</template>

<script>
export default {
  neme: 'Trend',
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      showChoice: false,
      choiceType: 'map', // 显示的数据类型
      titleFontSize: 0
    }
  },
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return []
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comSytle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginSytle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
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
  },
  methods: {
    // 初始化echarts
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },

        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('trend')
      this.allData = res
      this.updataChart()
    },
    // 处理数据
    updataChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      // 类目轴数据
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              }, {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例数据
      const legendArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr

        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOptition = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOptition)
      this.chartInstance.resize()
    },
    hanlderSelect (currentType) {
      this.choiceType = currentType
      this.updataChart()
      this.showChoice = !this.showChoice
    }
  }
}
</script>
<style lang="less" scoped>
.title{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 999;
  color: white;
  .title-icon{
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con{
    background-color: #222733;
  }
}
</style>
