export default class SocketService {
    static instance = null
    static get Instance () {
      if (!this.instance) {
        this.instance = new SocketService()
      }
      return this.instance
    }

  // 和服务端链接的socket对象
  ws =null
  // 存储回调函数
  callBackMapping = {}
  // 定义存储链接状态
  connectd = false
  // 定义记录重试发送数据次数
  sendRetryCount = 0
    // 定义记录重试发送数据次数
    connectRetryCount = 0
    // 定义链接服务器的方法
    connect () {
    // 连接服务器
      if (!window.WebSocket) {
        return console.log('您的浏览器不支持WebSocket')
      }
      this.ws = new WebSocket('ws://localhost:9998')

      // 连接成功的事件
      this.ws.onopen = () => {
        this.connectd = true
        this.connectRetryCount = 0
        console.log('连接服务端成功了')
      }
      // 1.连接服务端失败
      // 2.当连接成功之后, 服务器关闭的情况
      this.ws.onclose = () => {
        this.connectd = false
        this.connectRetryCount++
        console.log('连接服务端失败')
        setTimeout(() => {
          this.connect()
        }, 500 * this.connectRetryCount)
      }
      // 得到服务端发送过来的数据
      this.ws.onmessage = msg => {
        console.log('从服务端获取到了数据')
        // 真正服务端发送过来的原始数据时在msg中的data字段
        // console.log(msg.data)
        const recvData = JSON.parse(msg.data)
        const socketType = recvData.socketType
        if (this.callBackMapping[socketType]) {
          const action = recvData.action
          if (action === 'getData') {
            const realData = JSON.parse(recvData.data)
            this.callBackMapping[socketType].call(this, realData)
          } else if (action === 'fullScreen') {
            this.callBackMapping[socketType].call(this, recvData)
          } else if (action === 'themeChange') {
            this.callBackMapping[socketType].call(this, recvData)
          }
        }
      }
    }

    // 回调函数的注册
    registerCallBack (socketType, callBack) {
      this.callBackMapping[socketType] = callBack
    }

    // 回调函数的取消
    unRegisterCallBack (socketType) {
      this.callBackMapping[socketType] = null
    }

    // 发送数据的方法
    send (data) {
      if (this.connectd) {
        this.sendRetryCount = 0
        this.ws.send(JSON.stringify(data))
      } else {
        this.sendRetryCount++
        setTimeout(() => {
          this.send(data)
        }, 500 * this.sendRetryCount)
      }
    }
}
