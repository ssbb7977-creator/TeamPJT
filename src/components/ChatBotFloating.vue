<template>
  <div class="chatbot-floating">
    <button @click="open = !open">Chat</button>
    <div v-if="open" class="chatbox">챗봇 (실제 연결 필요)</div>
  </div>
</template>

<script>
export default { data: ()=>({ open:false }) }
</script>

<style scoped>
.chatbot-floating { position: fixed; right: 16px; bottom: 16px }
.chatbox { width:300px; height:400px; background:#fff; border:1px solid #ddd; margin-top:8px }
</style>
