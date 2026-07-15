<template>
  <section class="hero relative overflow-hidden rounded-xl text-white mb-6" role="banner" :style="bgStyle">
    <!-- ambient shapes -->
    <div class="absolute -right-24 -top-24 w-96 h-96 bg-secondary-container rounded-full opacity-30 filter blur-3xl pointer-events-none"></div>
    <div class="relative z-10 hero-inner grid gap-6 items-center">
      <div>
        <div class="inline-flex items-center gap-2 mb-4 badge" aria-hidden="true"> 
          <span class="material-symbols-outlined">sailing</span>
          Busan Guide
        </div>
        <h1 class="hero-title">부산을 탐험해보세요</h1>
        <p class="hero-desc">지역 행사, 축제, 숨겨진 명소까지 LocalHub에서 모두 찾아보세요.</p>
        <div class="flex gap-3">
          <router-link to="/map" class="hero-btn primary" aria-label="지도 탐색">지도 탐색</router-link>
          <router-link to="/board/write" class="hero-btn outline">커뮤니티 참여</router-link>
        </div>
      </div>
        <div class="hidden md:block">
          <div class="weather-hero-wrap">
            <WeatherWidget variant="hero" />
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import WeatherWidget from './WeatherWidget.vue'

export default {
  name: 'HeroBanner',
  components: { WeatherWidget },
  props: {
    bgImage: { type: String, default: '' }
  },
  computed: {
    bgStyle() {
      const img = this.bgImage || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=60'
      return {
        backgroundImage: `linear-gradient(180deg, rgba(0,87,184,0.92), rgba(0,71,141,0.92)), url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
  }
}
</script>

<style scoped>
.hero {
  min-height: 520px;
  padding-left: 64px;
  padding-right: 64px;
  display: flex;
  align-items: center;
}
.hero-inner { max-width: 1400px; margin: 0 auto; grid-template-columns: 1.1fr 1fr; }
.badge { background:#fff3cd; color:#7a4b00; padding:6px 10px; border-radius:999px; font-size:14px }
.hero-title { font-size:68px; font-weight:800; line-height:1.03; margin-bottom:12px }
.hero-desc { font-size:24px; margin-bottom:20px; color: rgba(255,255,255,0.9) }
.hero-btn { height:56px; display:inline-flex; align-items:center; justify-content:center; padding:0 20px; border-radius:10px; font-weight:700 }
.hero-btn.primary { background:#fff; color:#0b5fb8 }
.hero-btn.outline { background:transparent; border:2px solid rgba(255,255,255,0.18); color:#fff }
.weather-hero-wrap { width:500px; height:220px; }

@media (max-width: 960px) {
  .hero-inner { grid-template-columns: 1fr; gap:18px }
  .hero { padding-left:24px; padding-right:24px }
  .hero-title { font-size:36px }
  .hero-desc { font-size:16px }
  .weather-hero-wrap { width:100%; height:auto }
}
</style>
