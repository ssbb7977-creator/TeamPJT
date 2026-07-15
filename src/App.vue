<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <ChatBotFloating />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import ChatBotFloating from './components/ChatBotFloating.vue'

export default {
  components: { Header, Footer, ChatBotFloating }
}
</script>

<style>
#app { font-family: Avenir, Helvetica, Arial, sans-serif; }
main { padding: 16px; min-height: calc(100vh - 140px); }
</style>
