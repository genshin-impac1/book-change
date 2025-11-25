<template>
  <el-dialog
    title="实时聊天"
    :visible.sync="visible"
    width="420px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="chat-container">
      <div class="message-list" ref="msgList">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.fromUserId === user.id ? 'msg-right' : 'msg-left'"
        >
          <div class="msg-bubble">
            {{ msg.content }}
          </div>
          <div class="msg-time">
            {{ formatTime(msg.createdAt) }}
          </div>
        </div>
      </div>
      <div class="input-area">
        <el-input
          v-model="newMessage"
          placeholder="输入消息，按回车发送"
          @keyup.enter.native="sendMessage"
          size="large"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      visible: false,
      toUserId: null,
      messages: [],
      newMessage: '',
      socket: null
    }
  },
  computed: {
    user() {
      return this.$store.state.user || {}
    }
  },
  methods: {
    open(toUserId) {
      this.toUserId = toUserId
      this.visible = true
      this.loadHistory()
      this.connectSocket()
    },
    async loadHistory() {
      try {
        const res = await this.$http.get(`/chat/${this.toUserId}`)
        this.messages = res.data.data || []
        this.$nextTick(() => this.scrollToBottom())
      } catch (err) {
        this.$message.error('加载聊天记录失败')
      }
    },
    connectSocket() {
      this.socket = io('http://localhost:3000', {
        auth: { token: localStorage.getItem('token') }
      })

      this.socket.on('newMessage', (msg) => {
        if (
          (msg.fromUserId === this.toUserId && msg.toUserId === this.user.id) ||
          (msg.fromUserId === this.user.id && msg.toUserId === this.toUserId)
        ) {
          this.messages.push(msg)
          this.$nextTick(() => this.scrollToBottom())
        }
      })
    },
    sendMessage() {
      if (!this.newMessage.trim()) return
      this.socket.emit('sendMessage', {
        toUserId: this.toUserId,
        content: this.newMessage
      })
      this.newMessage = ''
    },
    scrollToBottom() {
      this.$refs.msgList.scrollTop = this.$refs.msgList.scrollHeight
    },
    formatTime(time) {
      const date = new Date(time)
      return date.toLocaleString('zh-CN', { hour12: false }).slice(5, -3)
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}
</script>

<style scoped>
.chat-container {
  height: 520px;
  display: flex;
  flex-direction: column;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}
.msg-left { text-align: left; margin: 12px 0; }
.msg-right { text-align: right; margin: 12px 0; }
.msg-bubble {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;
  font-size: 14px;
}
.msg-left .msg-bubble {
  background: #ffffff;
  border: 1px solid #e4e4e4;
}
.msg-right .msg-bubble {
  background: #409EFF;
  color: white;
}
.msg-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
.input-area {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>