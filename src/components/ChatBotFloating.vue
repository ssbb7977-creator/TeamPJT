<template>
  <div class="chatbot-floating" @keydown.esc="close">
    <button v-if="!open" class="fab" @click="toggle" :aria-expanded="open" aria-label="챗봇 열기">
      <img :src="iconUrl" alt="chatbot" class="fab-img" />
    </button>

    <transition name="fade">
      <div v-if="open" class="chatbox" role="dialog" aria-label="Chatbot">
        <header class="chat-header">
          <div>LocalHub 챗봇</div>
          <button class="close" @click="close" aria-label="닫기">✕</button>
        </header>

        <div class="messages" ref="msgList">
          <div v-for="m in messages" :key="m.id" :class="['msg', m.role]">
            <div class="text">{{ m.text }}</div>
            <div class="ts">{{ new Date(m.ts).toLocaleTimeString() }}</div>
          </div>
        </div>

        <form class="composer" @submit.prevent="handleSend">
          <input ref="inputEl" v-model="input" placeholder="메시지를 입력하세요..." aria-label="메시지" />
          <button type="submit" class="send">전송</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'

export default {
  data() {
    return { open: false, input: '', iconUrl: 'https://img.magnific.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80' }
  },
  setup() {
    const store = useChatStore()
    return { store }
  },
  mounted() {
    // initialize store from storage
    try { this.store.initFromStorage() } catch(e){}
    this.$nextTick(()=> this.scrollBottom())
  },
  computed: {
    messages() { return this.store.messages },
    loading() { return this.store.loading },
    error() { return this.store.error }
  },
  methods: {
    toggle() { this.open = !this.open; this.$nextTick(()=>{ this.scrollBottom(); if(this.open && this.$refs.inputEl) this.$refs.inputEl.focus(); }) },
    close() { this.open = false },
    scrollBottom() { const el = this.$refs.msgList; if (el) el.scrollTop = el.scrollHeight },
    async handleSend() {
      const text = (this.input || '').trim(); if (!text || this.store.loading) return
      this.input = ''
      await this.store.sendMessage(text)
      this.$nextTick(()=> this.scrollBottom())
    },
    clearHistory() { this.store.clearHistory(); this.$nextTick(()=> this.scrollBottom()) }
  }
}
</script>

<style scoped>
.chatbot-floating { position: fixed; right: 18px; bottom: 18px; z-index:60 }
.fab { width:56px; height:56px; border-radius:9999px; background:#00478d; color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(0,0,0,0.12); border:0 }
.fab-img { width:100%; height:100%; object-fit:cover; border-radius:9999px }
.chatbox { width:320px; height:420px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.12); overflow:hidden; display:flex; flex-direction:column }
.chat-header { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#00478d; color:#fff; font-weight:600 }
.chat-header .close { background:transparent; border:0; color:#fff; font-size:16px }
.messages { padding:12px; flex:1; overflow:auto; background:#f7fafc }
.msg { max-width:90%; margin-bottom:8px; padding:8px 10px; border-radius:10px }
.msg.user { background:#d6e3ff; align-self:flex-end }
.msg.assistant { background:#fff; border:1px solid #eee; align-self:flex-start }
.msg .ts { font-size:10px; color:#8892a6; margin-top:4px }
.composer { display:flex; gap:8px; padding:10px; border-top:1px solid #eee }
.composer input { flex:1; padding:8px 10px; border:1px solid #ddd; border-radius:8px }
.composer .send { background:#00478d; color:#fff; border:0; padding:8px 12px; border-radius:8px }

@media (max-width:640px) {
  .chatbox { width:100vw; height:50vh; right:0; left:0; bottom:0; border-radius:12px 12px 0 0 }
}

.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity:0 }
</style>
