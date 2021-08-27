<template>
  <div class="app-container">
    <div id="xterm" class="xterm" />
  </div>
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import { getRecordDetail } from '@/api/cmdb'
export default {
  name: 'Xterm',
  props: {
    socketURI: {
      type: String,
      default: `${process.env.VUE_APP_WS_API}/cmdb/web_terminal`
    }
  },
  data() {
    return {
      recordInfo: null
    }
  },
  mounted() {
    this.initSocket()
  },
  beforeDestroy() {
    this.socket.close()
    this.term.dispose()
  },
  methods: {
    async getServerInfo() {
      // 通过id去获取服务器信息
      await getRecordDetail(this.$route.params.id).then(response => {
        this.recordInfo = response.record_details
      })
    },
    initTerm() {
      // 计算高度和宽度
      const initWidth = 9
      const initHeight = 17
      const cols = Math.floor(window.innerWidth / initWidth)
      const rows = Math.floor(window.innerHeight / initHeight) - 3
      const term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        convertEol: true, // 启用时，光标将设置为下一行的开头
        disableStdin: false, // 是否应禁用输入。
        cursorBlink: true, // 光标闪烁
        cols: cols,
        rows: rows,
        theme: {
          foreground: 'yellow', // 字体
          background: '#111111', // 背景色
          cursor: 'help' // 设置光标
        }
      })
      const attachAddon = new AttachAddon(this.socket)
      const fitAddon = new FitAddon()
      term.loadAddon(attachAddon)
      term.loadAddon(fitAddon)
      term.open(document.getElementById('xterm'))
      fitAddon.fit()
      term.focus()
      this.term = term
    },
    async initSocket() {
      await this.getServerInfo()
      this.socket = new WebSocket(this.socketURI + `?username=${this.recordInfo.username}&password=${this.recordInfo.password}&port=${this.recordInfo.ssh_port}&ip=${this.recordInfo.ip}`)
      this.socketOnClose()
      this.socketOnOpen()
      this.socketOnError()
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        // 链接成功后
        this.initTerm()
      }
    },
    socketOnClose() {
      this.socket.onclose = () => {
        this.$alert('连接已经断开', 'Tips', {
          confirmButtonText: '退出',
          callback: action => {
            window.close()
          }
        })
      }
    },
    socketOnError() {
      this.socket.onerror = () => {
        this.$alert('连接失败,请联系管理员', 'Tips', {
          confirmButtonText: '退出',
          callback: action => {
            window.close()
          }
        })
      }
    }
  }
}
</script>
