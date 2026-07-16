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
          <button class="text-primary" @click="sortByDistance">{{ calculatingDistance ? '거리 계산중...' : (sortBy==='distance' ? '거리순(정렬됨)' : '거리순') }}</button>
        </div>
        <div class="overflow-y-auto pr-2 space-y-4 custom-scrollbar" style="max-height:520px">
          <div v-for="place in filteredPlaces.slice(0,50)" :key="place.contentid || place.title" @click="focusPlace(place)" class="bg-white rounded-xl p-3 shadow-md border hover:border-primary transition-all cursor-pointer">
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
                  <span class="text-primary text-sm flex items-center gap-1">{{ place.distance != null ? formatDistanceText(place.distance) : (calculatingDistance ? '거리 계산중...' : '거리 정보 없음') }}</span>
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
      selectedCategory: 'tour',
      places: [],
      userLocation: null,
      calculatingDistance: false,
      sortBy: null, // 'distance' or null
      map: null,
      markerLayer: null,
      mapCentered: false,
      markers: {},
      pendingFocusKey: null
    }
  },
  computed: {
    selectedLabel() {
      const map = { tour: '관광지', culture: '문화시설', festival: '축제', sports: '레포츠', stay: '숙박', shopping: '쇼핑' }
      return map[this.selectedCategory] || this.selectedCategory
    },
    filteredPlaces() {
      const arr = Array.isArray(this.places) ? this.places.slice() : []
      if (this.sortBy === 'distance') {
        arr.sort((a,b)=>{
          const da = (a.distance == null) ? Infinity : a.distance
          const db = (b.distance == null) ? Infinity : b.distance
          return da - db
        })
      }
      return arr
    }
  },
  // created() removed: location restore handled in mounted to ensure data loads first
    async mounted() {
    console.log('[Map] mounted')
    // load data first
    const q = this.$route && this.$route.query ? this.$route.query : {}
    if (q && q.category) {
      this.selectedCategory = q.category
      await this.load(q.category)
    } else {
      await this.load(this.selectedCategory)
    }

    // try to restore saved location from localStorage
    try {
      const stored = localStorage.getItem('localhub_location')
      if (stored) {
        const obj = JSON.parse(stored)
        const age = Date.now() - (obj.timestamp || 0)
        const FIVE_MIN = 1000 * 60 * 5
        if (age < FIVE_MIN && obj.lat != null && obj.lng != null) {
          this.userLocation = { lat: obj.lat, lng: obj.lng }
          console.debug('[Map] restored user location from storage')
          await this.computeDistances()
        }
      }
    } catch (e) { /* ignore parse errors */ }

    // restore sort mode if any
    try {
      const s = localStorage.getItem('localhub_sort')
      if (s) this.sortBy = s
    } catch (e) {}

    await this.ensureMap()
    this.renderMarkers()
    // if route has focus query on initial load, handle it
    if (q && q.focus) {
      this.pendingFocusKey = q.focus
      const cat = q.category || this.selectedCategory
      this.onCategoryChange(cat)
    }
  },
  watch: {
    '$route.query'(q) {
      this.handleRouteQuery(q)
    }
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
      // if we have a user location, recalculate distances for the newly loaded places
      if (this.userLocation) {
        try {
          await this.computeDistances()
          // if currently sorted by distance, force re-apply sort to trigger updates
          if (this.sortBy === 'distance') {
            // toggle to force reactive recompute
            this.sortBy = null
            await this.$nextTick()
            this.sortBy = 'distance'
          }
        } catch (e) { console.warn('[Map] computeDistances failed after category change', e) }
      }
      // ensure map then render markers (optimize marker updates)
      await this.ensureMap()
      this.renderMarkers()
    },
    selectCategory(val) {
      // invoked by UI pills
      this.onCategoryChange(val)
    },
    // handle route query changes
    handleRouteQuery(q) {
      if (!q) return
      if (q.category) {
        const cat = q.category
        this.onCategoryChange(cat)
      }
      if (q.focus) {
        this.pendingFocusKey = q.focus
        const cat = q.category || this.selectedCategory
        this.onCategoryChange(cat)
      }
    },
    focusPlace(place) {
      if (!place) return
      const key = place.contentid || place.id || place.title
      const marker = this.markers[key]
      if (!marker) {
        console.warn('[Map] marker not found for', key)
        return
      }
      try {
        this.ensureMap()
        const latlng = marker.getLatLng()
        this.map.flyTo(latlng, 15)
        marker.openPopup()
      } catch (e) {
        console.error('[Map] focusPlace error', e)
      }
    },
    renderMarkers() {
      if (!this.map || !this.markerLayer) return
      this.$nextTick(() => { try { this.map.invalidateSize() } catch(e) {} })
      // if showing all for category, show all items; otherwise limit? we'll show all up to a reasonable cap
      const cap = 1000
      const items = (this.places || []).slice(0, cap)
      // Build key list for current items
      const newKeys = new Set()
      const itemByKey = {}
      items.forEach(p => {
        const key = p.contentid || p.id || p.title
        if (key) {
          newKeys.add(key)
          itemByKey[key] = p
        }
      })

      // Remove markers that are no longer in newKeys
      for (const existingKey of Object.keys(this.markers)) {
        if (!newKeys.has(existingKey)) {
          try {
            const m = this.markers[existingKey]
            this.markerLayer.removeLayer(m)
            delete this.markers[existingKey]
          } catch (e) { /* ignore */ }
        }
      }

      // Add markers for keys that are new
      for (const key of newKeys) {
        if (this.markers[key]) continue // already exists
        const p = itemByKey[key]
        const lat = parseFloat(p.mapy || p.mapY || p.latitude || 0)
        const lng = parseFloat(p.mapx || p.mapX || p.longitude || 0)
        if (!isFinite(lat) || !isFinite(lng)) continue
        const marker = L.marker([lat, lng])
        const title = p.title || p.name || ''
        const addr = p.addr1 || p.address || ''
        const img = p.firstimage ? `<img src="${p.firstimage}" style="width:140px;height:84px;object-fit:cover;border-radius:6px;margin-bottom:6px;display:block">` : ''
        marker.bindPopup(`${img}<strong>${title}</strong><br/>${addr}`)
        this.markerLayer.addLayer(marker)
        this.markers[key] = marker
      }
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
      // if there's a pending focus request from route or elsewhere, focus now
      if (this.pendingFocusKey) {
        const key = this.pendingFocusKey
        const marker = this.markers[key]
        if (marker) {
          try {
            this.map.flyTo(marker.getLatLng(), 15)
            marker.openPopup()
          } catch (e) { console.error('[Map] focus pending error', e) }
        } else {
          console.warn('[Map] pending focus marker not found for', key)
        }
        this.pendingFocusKey = null
      }
    },
    formatDistanceText(d) {
      if (d == null || !isFinite(d)) return '거리 정보 없음'
      if (d < 1) return `${Math.round(d * 1000)}m`
      return `${(Math.round(d * 10) / 10).toFixed(1)}km`
    },
    async computeDistances() {
      if (!this.userLocation) return
      this.calculatingDistance = true
      const lat1 = Number(this.userLocation.lat)
      const lon1 = Number(this.userLocation.lng)
      const batchSize = 100
      const places = this.places || []
      for (let i=0;i<places.length;i+=batchSize) {
        const slice = places.slice(i, i+batchSize)
        slice.forEach(p => {
          const lat2 = parseFloat(p.mapy || p.mapY || p.latitude || 0)
          const lon2 = parseFloat(p.mapx || p.mapX || p.longitude || 0)
          if (!isFinite(lat2) || !isFinite(lon2)) { p.distance = null; return }
          p.distance = this.haversine(lat1, lon1, lat2, lon2)
        })
        // allow UI to update between batches
        // eslint-disable-next-line no-await-in-loop
        await new Promise(res => setTimeout(res, 0))
      }
      this.calculatingDistance = false
    },
    haversine(lat1, lon1, lat2, lon2) {
      const toRad = v => v * Math.PI / 180
      const R = 6371 // km
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },
    sortByDistance() {
      if (!this.userLocation) {
        // if no location, attempt to get once more
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            this.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            this.computeDistances().then(()=> { this.sortBy = 'distance'; try { localStorage.setItem('localhub_location', JSON.stringify({ lat: this.userLocation.lat, lng: this.userLocation.lng, timestamp: Date.now() })) } catch(e){}; try{ localStorage.setItem('localhub_sort', 'distance') } catch(e){} })
          }, err => { console.warn('geolocation denied', err); alert('거리 정보를 얻지 못했습니다.') })
        } else {
          alert('브라우저에서 위치 정보를 사용할 수 없습니다.')
        }
        return
      }
      // computeDistances may already have filled distances; set sort mode
      this.sortBy = (this.sortBy === 'distance') ? null : 'distance'
      try{ localStorage.setItem('localhub_sort', this.sortBy || '') } catch(e){}
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
