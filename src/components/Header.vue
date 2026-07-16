<template>
  <header class="site-header">
    <div class="container">
      <router-link to="/" class="logo">LocalHub</router-link>

      <nav :class="{ open: open }" class="main-nav">
        <router-link to="/" :class="{ active: isActive('/') }" @click.native="open = false">홈</router-link>
        <router-link to="/map" :class="{ active: isActive('/map') }" @click.native="open = false">지도</router-link>
        <router-link to="/calender" :class="{ active: isActive('/calender') }" @click.native="open = false">캘린더</router-link>
        <router-link to="/board" :class="{ active: isActive('/board') }" @click.native="open = false">게시판</router-link>
      </nav>

      <button class="menu-btn" @click="open = !open" aria-label="메뉴 열기/닫기">
        <span v-if="!open">☰</span>
        <span v-else>✕</span>
      </button>
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
      if (path === '/calender') return this.current === '/calender'
      return this.current === path
    }
  }
}
</script>

<style scoped>
.site-header { position:sticky; top:0; z-index:50; background:#fff; border-bottom:1px solid rgba(0,0,0,0.06); min-height:72px }
.container { display:flex; align-items:center; max-width:1400px; margin:0 auto; padding:0 64px; height:72px; position:relative }
.logo { font-weight:700; color:#0b5fb8; text-decoration:none; font-size:18px }
.main-nav { flex:1; display:flex; justify-content:center }
nav { display:flex; gap:20px }
nav a { color:#333; text-decoration:none; padding:8px 10px; font-weight:600 }
.active { color:#0b5fb8; border-bottom:2px solid #0b5fb8; padding-bottom:6px }
.menu-btn { display:none; background:transparent; border:0; font-size:20px }

@media (max-width: 720px) {
  .menu-btn { display:block }
  nav { position:fixed; right:16px; bottom:72px; background:#fff; flex-direction:column; padding:8px; border:1px solid #eee; display:none }
  nav.open { display:flex }

  @media (max-width: 720px) {
    .main-nav { display:none }
    .menu-btn { display:block }
  }
}
</style>
