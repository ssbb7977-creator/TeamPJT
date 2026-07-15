<template>
  <div class="app-layout">
    <Header />
    <main class="main-content">
      <slot />
    </main>
    <Footer />
    <ChatBotFloating />
  </div>
</template>

<script>
import Header from './Header.vue'
import Footer from './Footer.vue'
import ChatBotFloating from './ChatBotFloating.vue'

export default {
  name: 'AppLayout',
  components: { Header, Footer, ChatBotFloating }
}
</script>

<style scoped>
.app-layout { display:flex; flex-direction:column; min-height:100vh }
.main-content { flex:1; padding:16px; max-width:1200px; margin:0 auto; width:100% }
</style>
