<template>
  <div>
    <h1>Map</h1>

    <CategoryFilter v-model:value="selectedCategory" @change="onCategoryChange" />

    <section class="map-area">
      <p>선택 카테고리: <strong>{{ selectedCategory }}</strong> — 총 {{ filteredPlaces.length }}개</p>
      <div class="map-and-list">
              <div ref="mapEl" id="map" v-show="selectedCategory !== 'all'" style="height:400px; border:1px solid #ddd; border-radius:6px"></div>

        <ul class="place-list">
          <li v-for="place in filteredPlaces.slice(0,50)" :key="place.id || place.contentid || place.title">
            <PlaceCard :place="place" />
          </li>
        </ul>
      </div>
    </section>
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
      markerLayer: null
    }
  },
  computed: {
    // `places` already contains category-specific items loaded by `loadPlaces`
    filteredPlaces() {
      return Array.isArray(this.places) ? this.places : []
    }
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
      if (items.length) {
        const first = items[0]
        const lat = parseFloat(first.mapy || first.mapY || first.latitude || 0)
        const lng = parseFloat(first.mapx || first.mapX || first.longitude || 0)
        if (isFinite(lat) && isFinite(lng)) this.map.setView([lat, lng], 13)
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
