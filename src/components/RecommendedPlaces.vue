<template>
  <section class="recommended-places card">
    <div class="section-header">
      <h2 class="section-title">추천 장소</h2>
      <router-link class="view-all-link" :to="{ path: '/map', query: { category: 'tour' } }">전체보기 →</router-link>
    </div>
    <div class="places-grid">
      <article v-for="p in places.slice(0,8)" :key="p.contentid || p.title" class="place-card-grid">
        <div class="pc-img">
          <img :src="p.firstimage || '/images/default/default1.jpg'" loading="lazy" decoding="async" alt="" />
        </div>
        <div class="pc-body">
          <div class="pc-category">{{ p.contentType || p.contenttype || '' }}</div>
          <h4 class="pc-title">{{ p.title || p.name }}</h4>
          <div class="pc-addr">{{ p.addr1 || p.address || '' }}</div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { loadPlaces } from '../apis/busanData'
import PlaceCard from './PlaceCard.vue'

export default {
  name: 'RecommendedPlaces',
  components: { PlaceCard },
  data() { return { places: [] } },
  async mounted() {
    const data = await loadPlaces('tour')
    this.places = Array.isArray(data) ? data : []
  }
}
</script>

<style scoped>
.card { background:#fff; padding:20px; border-radius:12px }
.section-title { font-size:22px; font-weight:800; margin-bottom:12px }
.section-header { display:flex; align-items:center; justify-content:space-between; gap:12px }
.view-all-link { color:#0b5fb8; font-weight:700 }
.places-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px }
.place-card-grid { border-radius:12px; overflow:hidden; background:#fff; box-shadow: 0 8px 20px rgba(2,6,23,0.06); transition:transform .25s ease, box-shadow .25s ease }
.place-card-grid:hover { transform:translateY(-6px); box-shadow: 0 20px 40px rgba(2,6,23,0.12) }
.pc-img { height:160px; overflow:hidden }
.pc-img img { width:100%; height:160px; object-fit:cover; display:block }
.pc-body { padding:12px }
.pc-category { color:#0b5fb8; font-weight:700; font-size:12px; margin-bottom:6px }
.pc-title { font-size:16px; font-weight:800; margin-bottom:8px }
.pc-addr { font-size:13px; color:#666 }

@media (max-width:1200px) {
  .places-grid { grid-template-columns: repeat(3, 1fr) }
}
@media (max-width:960px) {
  .places-grid { grid-template-columns: repeat(2, 1fr) }
}
@media (max-width:640px) {
  .places-grid { grid-template-columns: 1fr }
}
</style>
