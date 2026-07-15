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

          <section class="mt-6">
            <h2 class="text-lg font-semibold mb-3">Highlights</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureCard title="광안리 야경 투어" desc="저녁 시간 추천 코스와 포토 스팟 안내" tag="추천" img="https://via.placeholder.com/320x180" />
              <FeatureCard title="국제시장 먹거리 투어" desc="국제시장 근처 맛집과 골목 추천" tag="맛집" img="https://via.placeholder.com/320x180" />
              <FeatureCard title="해운대 축제 가이드" desc="주말 공연 정보와 준비 팁을 제공합니다" tag="축제" img="https://via.placeholder.com/320x180" />
            </div>
          </section>
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
