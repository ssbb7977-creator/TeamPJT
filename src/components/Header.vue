<template>
  <header class="site-header">
    <div class="container">
      <router-link to="/" class="logo">LocalHub</router-link>

      <button class="menu-btn" @click="open = !open" aria-label="Toggle menu">
        <span v-if="!open">☰</span>
        <span v-else>✕</span>
      </button>

      <nav :class="{ open: open }">
        <router-link to="/" :class="{ active: isActive('/') }" @click.native="open = false">HOME</router-link>
        <router-link to="/map" :class="{ active: isActive('/map') }" @click.native="open = false">MAP</router-link>
        <router-link to="/board" :class="{ active: isActive('/board') }" @click.native="open = false">BOARD</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() { return { open: false } },
  computed: {
    current() { return this.$route.path }
  },
  methods: {
    isActive(path) {
      if (path === '/board') return this.current === '/board' || this.current.startsWith('/board/')
      return this.current === path
    }
  }
}
</script>

<style scoped>
.site-header { background:#fff; border-bottom:1px solid #eee }
.container { display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; padding:12px 16px }
.logo { font-weight:700; color:#222; text-decoration:none }
.menu-btn { display:none; background:transparent; border:0; font-size:20px }
nav { display:flex; gap:12px }
nav a { color:#333; text-decoration:none; padding:8px 6px }
.active { color:#007acc; font-weight:600 }

@media (max-width: 720px) {
  .menu-btn { display:block }
  nav { position:fixed; right:16px; bottom:72px; background:#fff; flex-direction:column; padding:8px; border:1px solid #eee; display:none }
  nav.open { display:flex }
}
</style>
