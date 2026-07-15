<template>
  <footer class="site-footer">
    <div class="inner">
      <div class="left">
        <div class="brand">LocalHub</div>
        <div class="copyright">© {{ year }} LocalHub.</div>
      </div>

      <div class="center attribution">
        이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다. 출처: 한국관광공사 (data.go.kr) · 라이선스: 공공누리 제3유형(출처표시·변경금지)
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() { return { year: new Date().getFullYear() } }
}
</script>

<style scoped>
.site-footer { padding:12px 16px; border-top:1px solid #eee; background:#fff }
.inner { max-width:1200px; margin:0 auto; display:flex; gap:16px; align-items:center; justify-content:space-between }
.brand { font-weight:700 }
.center a, .right a { margin-left:12px; color:#333; text-decoration:none }
.copyright { color:#666; font-size:13px }

@media (max-width:720px) {
  .inner { flex-direction:column; gap:8px; text-align:center }
  .center, .right { display:flex; gap:8px }
}
</style>
