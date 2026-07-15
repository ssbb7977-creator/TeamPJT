<template>
  <div class="board-write">
    <h1>게시글 작성</h1>

    <form @submit.prevent="submit">
      <div class="field">
        <label>제목</label>
        <input v-model="title" required />
      </div>

      <div class="field">
        <label>카테고리</label>
        <input v-model="category" placeholder="예: 추천, 맛집, 축제" />
      </div>

      <div class="field">
        <label>내용</label>
        <textarea v-model="content" rows="6" required></textarea>
      </div>

      <div class="field">
        <label>비밀번호 (수정/삭제 확인용)</label>
        <input v-model="password" type="password" required />
      </div>

      <div class="actions">
        <button type="submit">저장</button>
        <router-link to="/board">목록으로</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { addPost, seedExample } from '../utils/posts'

export default {
  name: 'BoardWrite',
  data() {
    return { title: '', content: '', password: '', category: '' }
  },
  mounted() {
    // seed examples on first load
    seedExample()
  },
  methods: {
    submit() {
      const now = Date.now()
      const post = {
        id: 'p-' + now,
        title: this.title,
        content: this.content,
        password: this.password,
        category: this.category || '기타',
        createdAt: now
      }
      addPost(post)
      this.$router.push('/board')
    }
  }
}
</script>

<style scoped>
.board-write { max-width:720px; margin:0 auto }
.field { margin-bottom:12px }
label { display:block; font-weight:600; margin-bottom:6px }
input, textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:6px }
.actions { display:flex; gap:12px; align-items:center }
button { padding:8px 12px; background:#007acc; color:#fff; border:0; border-radius:6px }
</style>
