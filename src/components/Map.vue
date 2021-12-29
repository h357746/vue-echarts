<template>
<div class="com-container" @dblclick="revertMap">
  <div class="com-chart" ref="map_ref"></div></div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  neme: 'Map',
  data () {
    return {
      chartInstance: null,
      allData: null, // 从服务器获取的所有数据
      mapData: {} // 获取的省份数据缓存
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
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart() // 调用初始化图表方法
    // this.getData() // 调用获取数据
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter) // 事件s监听
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$scoket.unRegisterCallBack('mapData')
  },
  methods: {
    // 初始化echarts
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▍商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取这个省份的地图矢量数据
        // 判断当前所点击的省份的数据是否已在缓存中
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key

          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取服务器数据
    getData (res) {
      // const { data: res } = await this.$http.get('map')
      this.allData = res
      this.updataChart()
    },
    // 处理数据
    updataChart () {
      // 处理数据
      // 图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const serierArr = this.allData.map(item => {
        // return的这个对象就代表的是一个类别下的左右散点数据//
        // 如果想在地图中显示散点的数据，所以我们需要给散点的图表增加配置 coordinateSystem: geo
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 6,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: serierArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器大小发生变化调用完成屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOptition = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 4
          }
        }
      }
      this.chartInstance.setOption(adapterOptition)
      this.chartInstance.resize()
    },
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
