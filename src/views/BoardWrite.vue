<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white rounded-xl shadow-md border p-6">
      <h1 class="text-2xl font-bold text-on-surface mb-3">게시글 작성</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">제목</label>
          <input v-model="title" required class="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">카테고리</label>
          <input v-model="category" placeholder="예: 추천, 맛집, 축제" class="w-full border border-slate-200 rounded-md px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">내용</label>
          <textarea v-model="content" rows="8" required class="w-full border border-slate-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">비밀번호 (수정/삭제 확인용)</label>
          <input v-model="password" type="password" required class="w-64 border border-slate-200 rounded-md px-3 py-2" />
        </div>

        <div class="flex items-center gap-3 pt-3">
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md shadow">저장</button>
          <router-link to="/board" class="text-sm text-slate-600">목록으로</router-link>
        </div>
      </form>
    </div>
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
/* minimal extra tweaks if needed */
.text-on-surface { color: #191c1d }
</style>
