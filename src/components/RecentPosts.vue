<template>
  <section class="recent-posts">
    <h2>최근 게시글</h2>
    <ul>
      <li v-for="p in posts.slice(0,5)" :key="p.id">
        <router-link :to="`/board/${p.id}`">{{ p.title }}</router-link>
        <div class="meta">{{ new Date(p.createdAt).toLocaleString() }}</div>
      </li>
    </ul>
    <router-link to="/board">더보기</router-link>
  </section>
</template>

<script>
import { loadPosts } from '../utils/posts'

export default {
  name: 'RecentPosts',
  data() { return { posts: [] } },
  mounted() { this.posts = loadPosts() }
}
</script>

<style scoped>
.recent-posts { background:#fff; padding:12px; border-radius:8px }
.recent-posts ul { list-style:none; padding:0; margin:0 }
.recent-posts li { padding:8px 0; border-bottom:1px solid #eee }
.meta { color:#666; font-size:12px }
</style>
