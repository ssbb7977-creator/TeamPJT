<template>
  <section class="recent-posts-section">
    <div class="container">
      <div class="grid">
        <div class="left">
          <h2 class="title">최근 게시글</h2>
          <p class="desc">부산 주민과 여행객들이 자유롭게 이야기를 나누는 공간입니다.</p>
          <router-link to="/board/write" class="primary-btn">토론 시작하기</router-link>
        </div>

        <div class="right">
          <ul class="post-list">
            <li v-for="p in latest" :key="p.id" class="post-item" @click="$router.push(`/board/${p.id}`)">
              <div class="post-left">
                <div class="icon">📝</div>
              </div>
              <div class="post-body">
                <div class="post-head">
                  <h3 class="post-title">{{ p.title }}</h3>
                  <span class="post-badge">{{ p.category || '기타' }}</span>
                </div>
                <div class="post-excerpt">{{ p.content }}</div>
                <div class="post-meta">
                  <span class="comments">💬 댓글 {{ p.comments ? p.comments.length : 0 }}</span>
                  <span class="dot">·</span>
                  <span class="time">🕒 {{ timeAgo(p.createdAt) }}</span>
                </div>
              </div>
            </li>
          </ul>

          <router-link to="/board" class="view-all">전체 게시글 보기</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { loadPosts } from '../utils/posts'

export default {
  name: 'RecentPosts',
  data() { return { posts: [] } },
  computed: {
    latest() { return this.posts }
  },
  mounted() { this.posts = loadPosts(3) },
  methods: {
    timeAgo(ts) {
      if (!ts) return ''
      const diff = Date.now() - Number(ts)
      const s = Math.floor(diff / 1000)
      const m = Math.floor(s / 60)
      const h = Math.floor(m / 60)
      const d = Math.floor(h / 24)
      if (d > 0) return `${d}일 전`
      if (h > 0) return `${h}시간 전`
      if (m > 0) return `${m}분 전`
      return '방금'
    }
  }
}
</script>

<style scoped>
.recent-posts-section { padding:80px 0 }
.container { max-width:1200px; margin:0 auto }
.grid { display:grid; grid-template-columns:320px 1fr; gap:56px; align-items:start }
.left .title { font-size:24px; font-weight:800; margin-bottom:8px }
.left .desc { color:#64748B; margin-bottom:20px }
.primary-btn { display:block; width:100%; height:60px; background:#0b5fb8; color:#fff; border-radius:16px; display:inline-flex; align-items:center; justify-content:center; font-weight:700; text-decoration:none }
.primary-btn:hover { transform:translateY(-4px); box-shadow: 0 12px 28px rgba(2,6,23,0.08); transition: .25s }
.post-list { list-style:none; padding:0; margin:0 }
.post-item { display:flex; gap:16px; padding:28px 0; border-bottom:1px solid #f1f5f9; cursor:pointer; transition: background .25s }
.post-item:hover { background:#FAFBFD }
.post-left { flex:0 0 48px }
.icon { width:48px; height:48px; border-radius:999px; background:#EEF5FF; display:flex; align-items:center; justify-content:center; font-size:20px }
.post-body { flex:1 }
.post-head { display:flex; align-items:flex-start; gap:12px }
.post-title { font-size:26px; font-weight:700; margin:0; color:#0b2f5a }
.post-badge { margin-left:auto; background:#FEF3C7; color:#7A4B00; border-radius:8px; padding:6px 12px; font-weight:700 }
.post-excerpt { margin-top:8px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.post-meta { margin-top:12px; color:#64748B; font-size:14px; display:flex; gap:12px; align-items:center }
.view-all { display:inline-block; margin-top:16px; color:#0b5fb8 }

@media (max-width:960px) {
  .grid { grid-template-columns: 1fr; gap:24px }
}
</style>
