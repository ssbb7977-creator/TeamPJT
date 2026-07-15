<template>
  <footer class="site-footer">
    <div class="inner">
      <div class="top">
        <div class="brand">LocalHub</div>
        <div class="links">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="#">문의</a>
        </div>
      </div>

      <div class="attribution">
        이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다. 출처: 한국관광공사 (data.go.kr) · 라이선스: 공공누리 제3유형(출처표시·변경금지)
      </div>

      <div class="copyright">© {{ year }} LocalHub Busan. All rights reserved.</div>
    </div>
  </footer>
</template>

<script>
export default {
  data() { return { year: new Date().getFullYear() } }
}
</script>

<style scoped>
.site-footer { padding:24px 16px; border-top:1px solid #e6eef8; background: #f7fbff }
.inner { max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:12px; align-items:center; text-align:center }
.brand { font-weight:700; font-size:18px; color:#0b5fb8 }
.links a { margin-left:12px; color:#0b5fb8; text-decoration:none }
.attribution { color:#666; font-size:13px; line-height:1.4; max-width:980px }
.copyright { color:#9aa6b2; font-size:13px }

@media (max-width:720px) {
  .inner { padding:12px 8px }
  .links { display:flex; gap:8px; flex-wrap:wrap; justify-content:center }
}
</style>
