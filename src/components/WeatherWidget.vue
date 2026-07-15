<template>
  <section :class="['weather-widget', variant==='hero' ? 'weather-hero' : '']">
    <div :class="['weather-card', variant==='hero' ? 'hero-card' : '']">
      <div class="card-header">
        <div class="card-meta">
          <div class="card-date">{{ displayTime }}</div>
          <div class="card-place">Busan</div>
        </div>
        <div class="card-icon" v-if="variant==='hero'">
          <span aria-hidden="true">☀️</span>
        </div>
      </div>

      <div class="card-body">
        <div class="stats">
          <div class="stat">
            <div class="label">현재</div>
            <div class="value">{{ temp }}°C</div>
          </div>
          <div class="stat">
            <div class="label">낮</div>
            <div class="value">{{ highText }}°C</div>
          </div>
          <div class="stat">
            <div class="label">밤</div>
            <div class="value">{{ lowText }}°C</div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </section>
</template>

<script>
import { getBusanCurrentWeather, mapWeatherCode, formatTimeIsoToKorean } from '../apis/weather'

export default {
  name: 'WeatherWidget',
  props: { variant: { type: String, default: '' } },
  data() {
    return {
      temp: '--',
      summary: '',
      displayTime: '',
      high: null,
      low: null,
      error: ''
    }
  },
  computed: {
    highText() { return this.high !== null ? this.high : '--' },
    lowText() { return this.low !== null ? this.low : '--' }
  },
  async mounted() {
    try {
      const res = await getBusanCurrentWeather();
      if (!res || !res.current) throw new Error('No weather data')
      const c = res.current
      this.temp = Math.round(c.temperature)
      this.summary = mapWeatherCode(c.weathercode)
      // Show the current local time when displaying weather (cached or fresh)
      this.displayTime = formatTimeIsoToKorean(new Date().toISOString())
      this.high = res.high !== null ? Math.round(res.high) : null
      this.low = res.low !== null ? Math.round(res.low) : null
    } catch (e) {
      this.error = '날씨 정보를 불러오지 못했습니다.'
      console.error(e)
    }
  }
}
</script>

<style scoped>
.weather-widget { background:#fff; padding:12px; border-radius:8px }

/* Card base */
.weather-card { border-radius:10px; padding:12px; background:rgba(255,255,255,0.98); color:#222 }
.weather-card .card-header { display:flex; justify-content:space-between; align-items:flex-start }
.card-date { font-size:12px; font-weight:700; color:#9fb6d9 }
.card-place { font-size:20px; font-weight:800; margin-top:6px }

.card-body { margin-top:14px }
.stats { display:flex; gap:12px }
.stat { background: rgba(0,0,0,0.04); padding:14px 18px; border-radius:8px; flex:1; text-align:center }
.stat .label { font-size:13px; color:#6b7280; margin-bottom:6px }
.stat .value { font-size:22px; font-weight:800 }

.error { color:#b91c1c; margin-top:8px }

/* Hero variant overrides */
.weather-hero { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(6px); color: #fff }
.weather-hero .weather-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.12); padding:18px; height:100%; box-sizing:border-box }
.weather-hero .card-date { color: rgba(255,255,255,0.8); font-size:12px; text-transform:uppercase }
.weather-hero .card-place { font-size:24px; font-weight:800; color:#fff }
.weather-hero .stats { margin-top:18px }
.weather-hero .stat { background: rgba(255,255,255,0.06); color:#fff; padding:18px; border-radius:10px }
.weather-hero .stat .label { color: rgba(255,255,255,0.8); font-size:13px }
.weather-hero .stat .value { font-size:26px; font-weight:900 }
.weather-hero .card-icon { font-size:22px; opacity:0.95 }

@media (max-width: 960px) {
  .weather-card { padding:10px }
  .card-place { font-size:18px }
  .stat .value { font-size:18px }
}
</style>
