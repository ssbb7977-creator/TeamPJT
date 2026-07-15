<template>
  <section class="recommended-places">
    <h2>추천 관광지</h2>
    <ul>
      <li v-for="p in places.slice(0,5)" :key="p.contentid || p.title">
        <PlaceCard :place="p" />
      </li>
    </ul>
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
.recommended-places { background:#fff; padding:12px; border-radius:8px }
.recommended-places ul { list-style:none; padding:0; margin:0 }
.recommended-places li { padding:8px 0; border-bottom:1px solid #eee }
</style>
