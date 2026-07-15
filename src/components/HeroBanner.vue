<template>
  <section class="hero relative overflow-hidden rounded-xl text-white p-8 mb-6" role="banner" :style="bgStyle">
    <!-- ambient shapes -->
    <div class="absolute -right-24 -top-24 w-96 h-96 bg-secondary-container rounded-full opacity-30 filter blur-3xl pointer-events-none"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-gutter grid md:grid-cols-2 gap-6 items-center">
      <div>
        <div class="inline-flex items-center gap-2 mb-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm" aria-hidden="true"> 
          <span class="material-symbols-outlined">sailing</span>
          지역 가이드 추천
        </div>
        <h1 class="text-4xl font-bold leading-tight mb-4">부산을 탐험해보세요</h1>
        <p class="mb-6 text-lg text-white/90">지역 행사, 축제, 숨겨진 명소까지 LocalHub에서 모두 찾아보세요.</p>
        <div class="flex gap-3">
          <router-link to="/map" class="bg-white text-primary px-4 py-2 rounded-md font-semibold" aria-label="지도 탐색">지도 탐색</router-link>
          <router-link to="/board/write" class="border border-white text-white px-4 py-2 rounded-md">커뮤니티 참여</router-link>
        </div>
      </div>
        <div class="hidden md:block">
          <div class="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
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
.hero { }
</style>
