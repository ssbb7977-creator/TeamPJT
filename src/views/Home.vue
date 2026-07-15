<template>
  <div class="home-page">
    <HeroBanner />

    <div class="home-content">
      <section class="section-row">
        <UpcomingFestivals />
      </section>

      <section class="section-row">
        <RecommendedPlaces />
      </section>

      <section class="section-row">
        <RecentPosts />
      </section>
    </div>
  </div>
</template>

<script>
import RecentPosts from '../components/RecentPosts.vue'
import RecommendedPlaces from '../components/RecommendedPlaces.vue'
import FestivalList from '../components/FestivalList.vue'
import UpcomingFestivals from '../components/UpcomingFestivals.vue'
import HeroBanner from '../components/HeroBanner.vue'
import FeatureCard from '../components/FeatureCard.vue'

export default { components: { RecentPosts, RecommendedPlaces, FestivalList, HeroBanner, FeatureCard, UpcomingFestivals } }
</script>

<style scoped>
.home-grid { display:flex; gap:16px }
.left { flex:2 }
.right { flex:1 }
</style>
