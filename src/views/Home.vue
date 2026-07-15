<template>
  <div class="home-page">
    <h1>Home</h1>
    <p>부산 소개, 날씨, 축제, 추천 관광지, 최근 게시글 등을 배치합니다.</p>

    <div class="home-grid">
      <div class="left">
        <section class="intro">
          <h2>부산 소개</h2>
          <p>부산은 대한민국 남동쪽에 위치한 항구 도시입니다.</p>
        </section>

        <section class="map-preview">
          <h2>추천 관광지 미리보기</h2>
          <RecommendedPlaces />
        </section>
      </div>

      <aside class="right">
        <WeatherWidget />
        <div style="height:12px"></div>
        <RecentPosts />
      </aside>
    </div>
  </div>
</template>

<script>
import RecentPosts from '../components/RecentPosts.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import RecommendedPlaces from '../components/RecommendedPlaces.vue'

export default { components: { RecentPosts, WeatherWidget, RecommendedPlaces } }
</script>

<style scoped>
.home-grid { display:flex; gap:16px }
.left { flex:2 }
.right { flex:1 }
</style>
