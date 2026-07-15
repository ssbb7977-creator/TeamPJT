<template>
  <div class="board-list">
    <header class="board-header">
      <h1>Board</h1>
      <router-link to="/board/write">글쓰기</router-link>
    </header>

    <div v-if="posts.length === 0">게시글이 없습니다.</div>

    <ul>
      <li v-for="p in posts" :key="p.id">
        <router-link :to="`/board/${p.id}`">
          <PlaceCard :place="{ title: p.title, addr1: '', firstimage: '' }" />
        </router-link>
        <div class="meta">
          <small>{{ new Date(p.createdAt).toLocaleString() }}</small>
          <span class="category">{{ p.category }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { loadPosts, seedExample } from '../utils/posts'
import PlaceCard from '../components/PlaceCard.vue'

export default {
  components: { PlaceCard },
  data() {
    return { posts: [] }
  },
  mounted() {
    // ensure examples exist, then load
    seedExample()
    this.posts = loadPosts()
  }
}
</script>

<style scoped>
.board-list { max-width:900px; margin:0 auto }
.board-header { display:flex; justify-content:space-between; align-items:center }
ul { list-style:none; padding:0 }
li { border-bottom:1px solid #eee; padding:8px 0 }
.meta { color:#666; font-size:12px }
.category { margin-left:8px }
</style>
