<template>
  <div class="board-page max-w-container-max mx-auto px-gutter">
    <header class="mb-6">
      <div class="flex items-end justify-between">
        <div>
          <div class="flex items-center gap-2 text-secondary mb-1">
            <span class="material-symbols-outlined text-sm">sailing</span>
            <span>Community Square</span>
          </div>
          <h2 class="text-2xl font-bold">Board & Discussions</h2>
          <p class="text-sm text-slate-600 mt-2">부산 커뮤니티와 소통하고 지역 정보를 공유하세요.</p>
        </div>
        <div class="flex gap-2">
          <button @click="view='list'" :class="view==='list'? 'bg-primary text-white px-4 py-2 rounded' : 'px-4 py-2 rounded'">목록</button>
          <router-link to="/board/write" class="px-4 py-2 rounded bg-primary text-white">글쓰기</router-link>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button v-for="c in categories" :key="c.value" @click="selectCategory(c.value)" :class="['px-4 py-2 rounded-full', selectedCategory===c.value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">{{ c.label }}</button>
      </div>
    </header>

    <!-- Table list -->
    <div class="bg-surface rounded-2xl border p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low text-on-surface-variant">
            <tr>
              <th class="px-4 py-3">제목</th>
              <th class="px-4 py-3">카테고리</th>
              <th class="px-4 py-3 hidden md:table-cell">날짜</th>
              <th class="px-4 py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pagedPosts" :key="p.id" class="hover:bg-surface-container-lowest transition-colors">
              <td class="px-4 py-3">
                <router-link :to="`/board/${p.id}`" class="font-medium text-on-surface">{{ p.title }}</router-link>
              </td>
              <td class="px-4 py-3">{{ p.category }}</td>
              <td class="px-4 py-3 hidden md:table-cell">{{ new Date(p.createdAt).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-right">
                <router-link :to="`/board/${p.id}`" class="text-primary">보기</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center gap-2 mt-4">
      <button class="px-3 py-1 border" @click="prevPage" :disabled="page===1">◀</button>
      <button v-for="n in totalPages" :key="n" @click="gotoPage(n)" :class="['px-3 py-1 rounded', page===n? 'bg-primary text-white':'border']">{{ n }}</button>
      <button class="px-3 py-1 border" @click="nextPage" :disabled="page===totalPages">▶</button>
    </div>
  </div>
</template>

<script>
import { loadPosts, seedExample } from '../utils/posts'

export default {
  data() {
    return {
      posts: [],
      selectedCategory: 'all',
      categories: [
        { label: '전체', value: 'all' },
        { label: '추천', value: '추천' },
        { label: '맛집', value: '맛집' },
        { label: '축제', value: '축제' }
      ],
      page: 1,
      pageSize: 10,
      view: 'list'
    }
  },
  computed: {
    filtered() {
      if (this.selectedCategory === 'all') return this.posts
      return this.posts.filter(p => p.category === this.selectedCategory)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filtered.length / this.pageSize))
    },
    pagedPosts() {
      const start = (this.page -1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  mounted() {
    seedExample()
    this.posts = loadPosts()
  },
  methods: {
    selectCategory(val) {
      this.selectedCategory = val
      this.page = 1
    },
    prevPage() { if (this.page>1) this.page-- },
    nextPage() { if (this.page < this.totalPages) this.page++ },
    gotoPage(n){ this.page = n }
  }
}
</script>

<style scoped>
.bg-surface { background: #fff }
.bg-surface-container-low { background: #f3f4f5 }
.text-on-surface { color: #191c1d }
.text-secondary { color: #2e6385 }
.max-w-container-max { max-width: 1280px }
</style>
