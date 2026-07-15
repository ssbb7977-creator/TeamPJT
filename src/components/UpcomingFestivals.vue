<template>
  <section class="upcoming-festivals">
    <div class="container-wrap">
      <div class="section-header">
        <h2 class="section-title">추천 축제</h2>
        <router-link class="view-all-link" :to="{ path: '/map', query: { category: 'festival' } }">전체보기 →</router-link>
      </div>
      <div class="fest-grid">
        <div class="left-area">
          <article class="hero-fest" v-if="picks[0]">
            <div class="hero-img" v-if="picks[0].firstimage" :style="`background-image:url(${picks[0].firstimage})`"></div>
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <div class="date-badge">{{ formatDate(picks[0]._eventDate) }}</div>
              <h3 class="hero-title">{{ picks[0].title }}</h3>
              <p class="hero-excerpt">{{ picks[0].addr1 }}</p>
            </div>
          </article>
        </div>

        <div class="right-area">
          <article class="side-fest" v-if="picks[1]">
            <div class="side-img" v-if="picks[1].firstimage" :style="`background-image:url(${picks[1].firstimage})`"></div>
            <div class="side-title">{{ picks[1].title }}</div>
          </article>

          <article class="side-fest" v-if="picks[2]">
            <div class="side-img" v-if="picks[2].firstimage" :style="`background-image:url(${picks[2].firstimage})`"></div>
            <div class="side-title">{{ picks[2].title }}</div>
          </article>
        </div>
      </div>
    </div>
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
.upcoming-festivals { padding:80px 0; }
.container-wrap { max-width:1200px; margin:0 auto; padding:0 24px }
.section-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px }
.view-all-link { color:#0b5fb8; font-weight:700 }
.section-title { font-size:28px; font-weight:800; margin-bottom:20px }
.fest-grid { display:grid; grid-template-columns: 2fr 1fr; gap:20px; align-items:start; height:460px }

.hero-fest { position:relative; border-radius:20px; overflow:hidden; height:460px; width:100%; transition:transform .25s ease, box-shadow .25s ease }
.hero-fest:hover { transform:translateY(-6px); box-shadow: 0 20px 40px rgba(2,6,23,0.12) }
.hero-img { position:absolute; inset:0; background-size:cover; background-position:center }
.hero-overlay { position:absolute; inset:0; background: linear-gradient(rgba(0,0,0,.05), rgba(0,0,0,.65)) }
.hero-content { position:absolute; left:24px; bottom:24px; z-index:3; color:#fff }
.date-badge { background:rgba(255,255,255,0.08); padding:6px 10px; border-radius:999px; font-size:13px; display:inline-block; margin-bottom:10px }
.hero-title { font-size:28px; font-weight:800; margin:0 0 8px }
.hero-excerpt { margin:0; opacity:0.95 }

.right-area { display:flex; flex-direction:column; gap:20px }
.side-fest { position:relative; border-radius:18px; overflow:hidden; height:220px; transition:transform .25s ease, box-shadow .25s ease }
.side-fest:hover { transform:translateY(-6px); box-shadow: 0 12px 28px rgba(2,6,23,0.08) }
.side-img { position:absolute; inset:0; background-size:cover; background-position:center }
.side-title { position:absolute; bottom:12px; left:12px; z-index:2; color:#fff; font-weight:800; text-shadow: 0 2px 6px rgba(0,0,0,0.6) }

@media (max-width: 768px) {
  .fest-grid { grid-template-columns: 1fr; height:auto }
  .hero-fest { height:320px }
  .side-fest { height:160px }
  .container-wrap { padding:0 16px }
}

</style>
