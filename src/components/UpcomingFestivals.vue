<template>
  <section class="upcoming-festivals bg-white rounded-xl p-4">
    <h2 class="text-lg font-semibold mb-3">Upcoming Festivals</h2>
    <ul class="space-y-3">
      <li v-for="f in picks" :key="f.contentid || f.title">
        <div class="flex items-start gap-3">
          <div class="w-20 h-12 bg-slate-200 overflow-hidden rounded">
            <img v-if="f.firstimage" :src="f.firstimage" class="w-full h-full object-cover" />
          </div>
          <div>
            <div class="text-sm font-bold">{{ f.title }}</div>
            <div class="text-xs text-slate-600">{{ formatDate(f._eventDate) }}</div>
            <div class="text-xs text-slate-600">{{ f.addr1 }}</div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { loadPlaces } from '../apis/busanData'

export default {
  name: 'UpcomingFestivals',
  data(){ return { places: [], picks: [] } },
  async mounted(){
    const data = await loadPlaces('festival')
    const items = Array.isArray(data) ? data : []
    // parse modifiedtime or createdtime as YYYYMMDD
    const parsed = items.map(it => {
      const mt = (it.modifiedtime || it.createdtime || '').toString()
      const ymd = mt.slice(0,8)
      const year = parseInt(ymd.slice(0,4))
      const month = parseInt(ymd.slice(4,6)) -1
      const day = parseInt(ymd.slice(6,8))
      const date = (!isNaN(year) && !isNaN(month) && !isNaN(day)) ? new Date(year, month, day) : null
      return { ...it, _eventDate: date }
    })
    const base = new Date() // use today's date as base
    const future = parsed.filter(p=>p._eventDate && p._eventDate >= base).sort((a,b)=>a._eventDate - b._eventDate)
    let picks = future.slice(0,3)
    if (picks.length < 3) {
      // fallback to nearest by date after base, or earliest dates
      const others = parsed.filter(p=>p._eventDate).sort((a,b)=>a._eventDate - b._eventDate)
      const needed = 3 - picks.length
      for (let i=0;i<others.length && picks.length<3;i++) if (!picks.includes(others[i])) picks.push(others[i])
    }
    this.places = items
    this.picks = picks
  },
  methods: {
    formatDate(d) { if (!d) return '' ; return d.toLocaleDateString() }
  }
}
</script>

<style scoped>
.upcoming-festivals { }
</style>
