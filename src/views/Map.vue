<template>
  <div class="map-page">
    <header class="mb-6">
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-2xl font-bold text-primary">지역 탐색</h1>
          <p class="text-sm text-slate-600">부산의 문화시설과 명소를 찾아보세요.</p>
        </div>
        <div class="hidden md:block">
          <div class="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg flex items-center gap-2 border">
            <span class="material-symbols-outlined">location_on</span>
            <span class="font-medium">부산, 대한민국</span>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex flex-wrap gap-2">
          <button @click="selectCategory('all')" :class="['px-4 py-2 rounded-full', selectedCategory==='all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">전체</button>
          <button @click="selectCategory('tour')" :class="['px-4 py-2 rounded-full', selectedCategory==='tour' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">관광지</button>
          <button @click="selectCategory('culture')" :class="['px-4 py-2 rounded-full', selectedCategory==='culture' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">문화시설</button>
          <button @click="selectCategory('festival')" :class="['px-4 py-2 rounded-full', selectedCategory==='festival' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">축제</button>
          <button @click="selectCategory('sports')" :class="['px-4 py-2 rounded-full', selectedCategory==='sports' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">레포츠</button>
          <button @click="selectCategory('stay')" :class="['px-4 py-2 rounded-full', selectedCategory==='stay' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">숙박</button>
          <button @click="selectCategory('shopping')" :class="['px-4 py-2 rounded-full', selectedCategory==='shopping' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">쇼핑</button>
        </div>
      </div>

      <div class="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg">
        <span class="text-sm text-slate-600">선택 카테고리:</span>
        <span class="font-medium text-primary">{{ selectedLabel }}</span>
        <span class="text-slate-400 mx-2">—</span>
        <span class="text-sm text-slate-600">총 {{ filteredPlaces.length }}개</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 relative overflow-hidden rounded-xl bg-white shadow-md border p-0">
        <div ref="mapEl" id="map" class="w-full min-h-[520px]"></div>

        <!-- Controls -->
        <div class="absolute bottom-4 right-4 flex flex-col gap-2">
          <button class="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center">+</button>
          <button class="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center">-</button>
          <button class="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center text-primary">◎</button>
        </div>
        <div class="absolute bottom-1 left-2 text-xs text-slate-500">© OpenStreetMap contributors · TourAPI 4.0</div>
      </div>

      <aside class="lg:col-span-4 flex flex-col gap-4">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-lg font-semibold">추천 장소</h2>
          <button class="text-primary">거리순</button>
        </div>
        <div class="overflow-y-auto pr-2 space-y-4 custom-scrollbar" style="max-height:520px">
          <div v-for="place in filteredPlaces.slice(0,50)" :key="place.contentid || place.title" class="bg-white rounded-xl p-3 shadow-md border hover:border-primary transition-all cursor-pointer">
            <div class="flex gap-4">
              <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="place.firstimage" class="w-full h-full object-cover" v-if="place.firstimage" />
                <div class="w-full h-full bg-slate-200" v-else></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <h3 class="font-bold truncate">{{ place.title }}</h3>
                </div>
                <p class="text-sm text-slate-600 mt-1 truncate">{{ place.addr1 }}</p>
                <div class="mt-3 flex items-center gap-2">
                  <span class="bg-secondary-container text-on-secondary-container text-xs px-2 py-0.5 rounded-full font-bold">{{ place.lclsSystm2 || '' }}</span>
                  <span class="text-primary text-sm flex items-center gap-1">거리: --km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import CategoryFilter from '../components/CategoryFilter.vue'
import { loadPlaces } from '../apis/busanData'
import L from 'leaflet'
import 'leaflet.markercluster'

// Fix Leaflet's default icon path for Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

import PlaceCard from '../components/PlaceCard.vue'

export default {
  components: { CategoryFilter, PlaceCard },
  data() {
    return {
      selectedCategory: 'all',
      places: [],
      map: null,
      markerLayer: null,
      mapCentered: false
    }
  },
  computed: {
    selectedLabel() {
      const map = { all: '전체', tour: '관광지', culture: '문화시설', festival: '축제', sports: '레포츠', stay: '숙박', shopping: '쇼핑' }
      return map[this.selectedCategory] || this.selectedCategory
    },
    filteredPlaces() { return Array.isArray(this.places) ? this.places : [] }
  },
  mounted() {
    console.log('[Map] mounted')
    this.load('all')
  },
  beforeUnmount() {
    if (this.map) this.map.remove()
  },
  methods: {
    async load(cat = 'all') {
      const data = await loadPlaces(cat)
      this.places = Array.isArray(data) ? data : []
    },
    async onCategoryChange(val) {
      console.log('[Map] category change ->', val)
      this.selectedCategory = val
      // load data once, then handle map and markers explicitly
      await this.load(val)
      if (val === 'all') {
        if (this.map) {
          this.map.remove()
          this.map = null
          this.markerLayer = null
          const el = this.$refs.mapEl
          if (el && el._leaflet_id) try { delete el._leaflet_id } catch(e){ /* ignore */ }
          console.log('[Map] map removed for all category')
        }
        return
      }
      // for non-all categories: ensure map then render markers
      await this.ensureMap()
      this.renderMarkers()
    },
    selectCategory(val) {
      // invoked by UI pills
      this.onCategoryChange(val)
    },
    renderMarkers() {
      if (!this.map || !this.markerLayer) return
      this.$nextTick(() => { try { this.map.invalidateSize() } catch(e) {} })
      // if showing all for category, show all items; otherwise limit? we'll show all up to a reasonable cap
      const cap = 1000
      const items = (this.places || []).slice(0, cap)
      this.markerLayer.clearLayers()
      items.forEach(p => {
        const lat = parseFloat(p.mapy || p.mapY || p.latitude || 0)
        const lng = parseFloat(p.mapx || p.mapX || p.longitude || 0)
        if (!isFinite(lat) || !isFinite(lng)) return
        const marker = L.marker([lat, lng])
        const title = p.title || p.name || ''
        const addr = p.addr1 || p.address || ''
        const img = p.firstimage ? `<img src="${p.firstimage}" style="width:140px;height:84px;object-fit:cover;border-radius:6px;margin-bottom:6px;display:block">` : ''
        marker.bindPopup(`${img}<strong>${title}</strong><br/>${addr}`)
        marker.addTo(this.markerLayer)
      })
      setTimeout(()=>{ try { this.map.invalidateSize() } catch(e){} }, 300)
      if (items.length && !this.mapCentered) {
        const first = items[0]
        const lat = parseFloat(first.mapy || first.mapY || first.latitude || 0)
        const lng = parseFloat(first.mapx || first.mapX || first.longitude || 0)
        if (isFinite(lat) && isFinite(lng)) {
          this.map.setView([lat, lng], 13)
          this.mapCentered = true
        }
      }
      console.log('[Map] rendered markers, count=', items.length)
    },
    async ensureMap() {
      if (this.map) return
      // wait for DOM to render map container
      await this.$nextTick()
      const el = this.$refs.mapEl
      if (!el) {
        console.warn('[Map] map element not found yet')
        return
      }
      // if element still has leaflet id from previous init, remove it to allow re-init
      if (el._leaflet_id) {
        try { delete el._leaflet_id } catch (e) { /* ignore */ }
      }
      try {
        this.map = L.map(el).setView([35.1796, 129.0756], 11)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map)
        // use marker cluster group for better performance with many markers
        this.markerLayer = L.markerClusterGroup()
        this.map.addLayer(this.markerLayer)
        // ensure proper sizing after render
        this.$nextTick(() => {
          try { this.map.invalidateSize() } catch(e) {}
          setTimeout(() => { try { this.map.invalidateSize() } catch(e) {} }, 300)
        })
        this.mapCentered = false
        console.log('[Map] map initialized')
      } catch (e) {
        console.error('[Map] failed to init map', e)
      }
    }
  }
}
</script>

<style scoped>
.map-area { margin-top:12px }
.map-and-list { display:flex; gap:16px; align-items:stretch }
.map-and-list #map { flex:1; min-width:320px; height:400px }
.place-list { list-style:none; padding:0; margin:0; width:320px; max-height:400px; overflow:auto; flex:0 0 320px }
.place-list li { padding:8px 0; border-bottom:1px solid #eee }
.place-title { font-weight:600 }
.place-addr { color:#666; font-size:13px }

@media (max-width:900px) {
  .map-and-list { flex-direction:column }
  .place-list { width:100%; max-height:240px }
}
</style>
