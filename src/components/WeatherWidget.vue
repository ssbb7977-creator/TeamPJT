<template>
  <section class="weather-widget">
    <h2>오늘의 날씨</h2>
    <div class="row">
      <div class="date">{{ data.date }}</div>
      <div class="summary">{{ data.summary }}</div>
    </div>
    <div class="temps">현재 {{ data.temp }}°C · 낮 {{ data.high }}°C · 밤 {{ data.low }}°C</div>
  </section>
</template>

<script>
import data from '../data/weather_today.json'

export default {
  name: 'WeatherWidget',
  data() { return { data } }
}
</script>

<style scoped>
.weather-widget { background:#fff; padding:12px; border-radius:8px }
.row { display:flex; justify-content:space-between; align-items:center }
.date { font-weight:600 }
.summary { font-size:14px; color:#007acc }
.temps { margin-top:8px; color:#666 }
</style>
