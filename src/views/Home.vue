<template>
  <div class="home-page">
    <HeroBanner />

    <div class="home-grid">
      <div class="left">
        <section class="intro">
          <h2>부산 소개</h2>
          <p>부산은 대한민국 남동쪽에 위치한 항구 도시입니다.</p>
        </section>

        <section class="map-preview">
          <h2>추천 관광지</h2>
          <RecommendedPlaces />
        </section>

        <div class="mt-4">
          <UpcomingFestivals />
        </div>

          <!-- Highlights removed to avoid duplication with Community Voices -->
      </div>

      <aside class="right">
        <WeatherWidget />
        <div style="height:12px"></div>
        <RecommendedPlaces />
      </aside>
    </div>

    <!-- Community Voices (Recent Posts) at bottom -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold mb-3">Community Voices</h2>
      <RecentPosts />
    </section>
  </div>
</template>

<script>
import RecentPosts from '../components/RecentPosts.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import RecommendedPlaces from '../components/RecommendedPlaces.vue'
import FestivalList from '../components/FestivalList.vue'
import UpcomingFestivals from '../components/UpcomingFestivals.vue'
import HeroBanner from '../components/HeroBanner.vue'
import FeatureCard from '../components/FeatureCard.vue'

export default { components: { RecentPosts, WeatherWidget, RecommendedPlaces, FestivalList, HeroBanner, FeatureCard, UpcomingFestivals } }
</script>

<style scoped>
.home-grid { display:flex; gap:16px }
.left { flex:2 }
.right { flex:1 }
</style>
