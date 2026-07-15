<template>
  <section class="festival-list">
    <h2 class="text-lg font-semibold mb-3">축제 및 공연</h2>
    <ul class="space-y-4">
      <li v-for="p in places.slice(0,5)" :key="p.contentid || p.title">
        <PlaceCard :place="{ title: p.title, addr1: p.addr1, firstimage: p.firstimage }" />
      </li>
    <ul>
        <li v-for="p in places.slice(0,5)" :key="p.contentid || p.title">
          <div @click="gotoMap(p)" class="cursor-pointer">
            <PlaceCard :place="{ title: p.title, addr1: p.addr1, firstimage: p.firstimage }" />
          </div>
        </li>
      </ul>
<script>
import { loadPlaces } from '../apis/busanData'
import PlaceCard from './PlaceCard.vue'

export default {
  name: 'FestivalList',
  components: { PlaceCard },
  data(){ return { places: [] } },
  async mounted(){
    const data = await loadPlaces('festival')
    this.places = Array.isArray(data) ? data : []
  }
  ,
  methods: {
    gotoMap(p) {
      const key = p.contentid || p.id || p.title
      this.$router.push({ path: '/map', query: { focus: key, category: 'festival' } })
    }
  }
}
</script>

<style scoped>
.festival-list { background:#fff; padding:12px; border-radius:8px }
</style>
