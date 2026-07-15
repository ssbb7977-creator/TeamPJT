<template>
  <section class="hero relative overflow-hidden rounded-xl bg-primary-container text-white p-8 mb-6">
    <!-- ambient shapes -->
    <div class="absolute -right-24 -top-24 w-96 h-96 bg-secondary-container rounded-full opacity-30 filter blur-3xl pointer-events-none"></div>
    <div class="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
      <div>
        <div class="inline-flex items-center gap-2 mb-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"> 
          <span class="material-symbols-outlined">sailing</span>
          지역 가이드 추천
        </div>
        <h1 class="text-4xl font-bold leading-tight mb-4">부산을 탐험해보세요</h1>
        <p class="mb-6 text-lg text-white/90">지역 행사, 축제, 숨겨진 명소까지 LocalHub에서 모두 찾아보세요.</p>
        <div class="flex gap-3">
          <router-link to="/map" class="bg-white text-primary px-4 py-2 rounded-md font-semibold">지도 탐색</router-link>
          <router-link to="/board/write" class="border border-white text-white px-4 py-2 rounded-md">커뮤니티 참여</router-link>
        </div>
      </div>
      <div class="hidden md:block">
        <div class="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <div class="text-sm text-white/80">오늘의 추천</div>
          <h3 class="mt-2 font-semibold">해운대 야경 투어</h3>
          <p class="text-sm text-white/80 mt-1">저녁 시간 추천 코스와 팁을 확인하세요.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default { name: 'HeroBanner' }
</script>

<style scoped>
.hero { background-image: linear-gradient(180deg, rgba(0,87,184,0.92), rgba(0,71,141,0.92)); }
</style>
